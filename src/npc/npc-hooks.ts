import { useCallback, useEffect } from "preact/hooks";
import { makeDataQuery, useDefinedQuery, useUpdateData } from "../data/util";
import { HUMAN_DEFINITIONS, NPC_SCHEDULES, type HumanType } from "./human-definitions";
import { defaultNPCStore, type HumanInstance, type NPCStore } from "./npc-types";
import { objectEntries } from "../util";
import { mergeWith } from "lodash";

export const npcQuery = makeDataQuery("NPCS", defaultNPCStore);

const generateInstance = (id: string, type: HumanType): HumanInstance => {
  const def = HUMAN_DEFINITIONS[type];
  const age = def.age.min + Math.floor(Math.random() * (def.age.max - def.age.min + 1));
  const sex = def.sex ?? (Math.random() < 0.5 ? "male" : "female");

  return {
    id,
    type,
    name: def.id, // placeholder — proper name generation is future work
    sex,
    age,
    home: def.home,
    attributes: { strength: 20, constitution: 20, dexterity: 20, wisdom: 20, intelligence: 20 },
    equipment: { ...def.equipment },
    resources: { ...def.replenishment, coin: def.allowance },
    allowance: def.allowance,
    interestValues: def.interestValues,
    sellList: [...def.sellList],
    schedule: NPC_SCHEDULES[type] ?? {},
    trust: 0,
  };
};

export const useNPCs = () => {
  const { data } = useDefinedQuery(npcQuery);
  return data;
};

export const useMutateNPCs = () => {
  const npcs = useNPCs();
  const { mutate } = useUpdateData<NPCStore>("NPCS", defaultNPCStore);

  const mutateNPC = (id: string, updatedInstance: Partial<HumanInstance>) => {
    const npc = npcs[id] || {};
    mutate({
      [id]: {
        ...npc,
        ...updatedInstance,
      },
    });
  };
  return { mutateNPCs: mutate, mutateNPC };
};

/** Price the NPC pays when buying a resource from the player (below intrinsic value). */
export const npcBuyPrice = (value: number) => Math.floor(value * 0.7);
/** Price the NPC charges when selling a resource to the player (above intrinsic value). */
export const npcSellPrice = (value: number) => Math.ceil(value * 1.4);

export const useHandleNPCs = () => {
  const npcs = useNPCs();
  const { mutateNPC } = useMutateNPCs();

  return { npcs, mutateNPC };
};

export const useGetOrCreateNPC = () => {
  const npcs = useNPCs();
  const { mutateNPCs } = useMutateNPCs();

  const getOrCreate = useCallback(
    (id: string, type: HumanType): HumanInstance => {
      const existing = npcs[id];
      if (existing) return existing;

      const instance = generateInstance(id, type);
      mutateNPCs({ [id]: instance });
      return instance;
    },
    [npcs, mutateNPCs],
  );

  return getOrCreate;
};

export const useNPC = (id: string, type: HumanType) => {
  const npcs = useNPCs();
  const { mutateNPCs } = useMutateNPCs();
  const existing = npcs[id];

  useEffect(() => {
    if (!existing) {
      const instance = generateInstance(id, type);
      mutateNPCs({ [id]: instance });
    }
  });

  return { ...existing };
};

export const useHandleNPCAllowance = () => {
  const npcs = useNPCs();
  const { mutateNPCs } = useMutateNPCs();

  return useCallback(() => {
    const updates = objectEntries(npcs).reduce((acc, [id, npc]) => {
      const def = HUMAN_DEFINITIONS[npc.type];
      const currentCoin = npc.resources.coin ?? 0;
      const maxCoin = Math.floor(npc.allowance * 1.5);
      const newCoin = Math.min(currentCoin + npc.allowance, maxCoin);
      const resourcesCapped = mergeWith({ ...npc.resources }, def.interestValues, (a = 0, b) => {
        const cap = Math.floor(npc.allowance / b);
        return Math.min(a, cap);
      });
      acc[id] = {
        ...npc,
        schedule: NPC_SCHEDULES[npc.type] ?? {},
        resources: {
          ...mergeWith({ ...resourcesCapped }, def.replenishment, (a = 0, b) => {
            return Math.min(a + b, Math.floor(b * 1.5));
          }),
          coin: newCoin,
        },
        interestValues: def.interestValues,
      };
      return acc;
    }, {} as NPCStore);
    mutateNPCs(updates);
  }, [npcs, mutateNPCs]);
};
