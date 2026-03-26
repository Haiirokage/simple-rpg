import { useCallback, useEffect, useMemo } from "preact/hooks";
import { makeDataQuery, useDefinedQuery, useUpdateData } from "../data/util";
import {
  HUMAN_DEFINITIONS,
  NPC_SCHEDULES,
  getScheduledLocation,
  type HumanType,
} from "./human-definitions";
import { CREATURES } from "./creature-definitions";
import { defaultNPCStore, type NPCStore } from "./npc-types";
import type { HumanInstance } from "./creature-types";
import type { BiomeType } from "../biome/discovery-types";
import { useTime } from "../data/time/hooks";
import { objectEntries } from "../util";
import { mergeWith } from "lodash";

export const npcQuery = makeDataQuery("NPCS", defaultNPCStore);

const generateInstance = (id: string, type: HumanType): HumanInstance => {
  const def = HUMAN_DEFINITIONS[type];
  const age = def.age.min + Math.floor(Math.random() * (def.age.max - def.age.min + 1));
  const sex = def.sex ?? (Math.random() < 0.5 ? "male" : "female");

  return {
    ...CREATURES["human"],
    definition: def,
    attributes: def.attributes,
    id,
    type,
    name: def.id,
    sex,
    age,
    resources: { ...def.replenishment, coin: def.allowance },
    equipment: { ...def.equipment },
    sellList: [...def.sellList],
    schedule: NPC_SCHEDULES[type] ?? {},
    trust: 0,
    health: 100,
    maxHealth: 100,
    distance: 0,
    hostile: false,
    discovered: true,
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

  /** Grant trust up to cap, never reducing below current value. */
  const grantTrust = (id: string, amount: number, cap: number) => {
    const npc = npcs[id];
    if (!npc) return;
    const newTrust = Math.min(cap, npc.trust + amount);
    mutateNPC(id, { trust: Math.max(npc.trust, newTrust) });
  };

  return { npcs, mutateNPC, grantTrust };
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

export const useNPCsAtLocation = (biome: BiomeType, location: string) => {
  const npcs = useNPCs();
  const { time } = useTime();
  return useMemo(
    () =>
      Object.values(npcs).filter((npc) => {
        const loc = getScheduledLocation(npc.schedule, time);

        return loc?.biome === biome && loc?.location === location;
      }),
    [npcs, biome, location, time],
  );
};

export const useHandleNPCAllowance = () => {
  const npcs = useNPCs();
  const { mutateNPCs } = useMutateNPCs();

  return useCallback(() => {
    const updates = objectEntries(npcs).reduce((acc, [id, npc]) => {
      const def = HUMAN_DEFINITIONS[npc.type];
      const currentCoin = npc.resources.coin ?? 0;
      const maxCoin = Math.floor(def.allowance * 1.5);
      const newCoin = Math.min(currentCoin + def.allowance, maxCoin);
      const resourcesCapped = mergeWith({ ...npc.resources }, def.interestValues, (a = 0, b) => {
        const cap = Math.floor(def.allowance / b);
        return Math.min(a, cap);
      });
      acc[id] = {
        ...npc,
        definition: def,
        schedule: NPC_SCHEDULES[npc.type] ?? {},
        resources: {
          ...mergeWith({ ...resourcesCapped }, def.replenishment, (a = 0, b) => {
            return Math.min(a + b, Math.floor(b * 1.5));
          }),
          coin: newCoin,
        },
      };
      return acc;
    }, {} as NPCStore);
    mutateNPCs(updates);
  }, [npcs, mutateNPCs]);
};
