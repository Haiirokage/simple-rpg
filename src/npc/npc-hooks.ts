import { useCallback } from "preact/hooks";
import { useDataQuery, useUpdateData } from "../data/util";
import { HUMAN_DEFINITIONS, type HumanType } from "./human-definitions";
import { defaultNPCStore, type HumanInstance, type NPCStore } from "./npc-types";
import { objectEntries } from "../util";

const NPC_KEY = "NPCS";

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
    attributes: { strength: 20, constitution: 20, dexterity: 20, wisdom: 20 },
    equipment: { ...def.equipment },
    resources: { ...def.resources, coin: def.allowance },
    allowance: def.allowance,
    budget: def.budget,
    sellList: [...def.sellList],
  };
};

export const useNPCs = () => {
  const { data } = useDataQuery<NPCStore>(NPC_KEY, defaultNPCStore);
  return data;
};

export const useMutateNPCs = () => {
  const { mutate } = useUpdateData<NPCStore>(NPC_KEY, defaultNPCStore);
  return mutate;
};

export const useGetOrCreateNPC = () => {
  const npcs = useNPCs();
  const mutate = useMutateNPCs();

  const getOrCreate = useCallback(
    (id: string, type: HumanType): HumanInstance => {
      const existing = npcs[id];
      if (existing) return existing;

      const instance = generateInstance(id, type);
      mutate({ [id]: instance });
      return instance;
    },
    [npcs, mutate],
  );

  return getOrCreate;
};

export const useHandleNPCAllowance = () => {
  const npcs = useNPCs();
  const mutate = useMutateNPCs();

  return useCallback(() => {
    const updates = objectEntries(npcs).reduce((acc, [id, npc]) => {
      const currentCoin = npc.resources.coin ?? 0;
      const maxCoin = Math.floor(npc.allowance * 1.5);
      const newCoin = Math.min(currentCoin + npc.allowance, maxCoin);
      acc[id] = {
        ...npc,
        resources: { ...npc.resources, coin: newCoin },
      };
      return acc;
    }, {} as NPCStore);
    mutate(updates);
  }, [npcs, mutate]);
};
