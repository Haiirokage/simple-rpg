import type { ResourceStore } from "../../data/resources/types";
import type { AttributeStore } from "../../data/attributes/types";
import type { AllUnlockableDiscoveries } from "../../data/discoveries/types";

export type ActionId = "forage" | "gatherWood" | "gatherStone" | "gatherTubers";

export interface ActionDefinition {
  id: ActionId;
  name: string;
  cost: {
    time: number;
    energy: number;
    resources?: Partial<ResourceStore>;
  };
  resourceYield?: Partial<ResourceStore>;
  // Gate: requires N discoveries of a specific type
  discoveriesRequired?: Partial<Record<AllUnlockableDiscoveries, number>>;
  // Experience grant: XP per unit of resource yielded
  experienceGrant?: Partial<Record<keyof AttributeStore, number>>;
  // Gate: requires knowledge level
  knowledgeRequired?: number;
}

export const FOREST_ACTIONS: Record<ActionId, ActionDefinition> = {
  forage: {
    id: "forage",
    name: "Forage for Berries",
    cost: {
      time: 3,
      energy: 5,
    },
    resourceYield: { berry: 10 },
    discoveriesRequired: { berry_patch: 1 },
  },
  gatherWood: {
    id: "gatherWood",
    name: "Gather Wood",
    cost: {
      time: 2,
      energy: 10,
    },
    resourceYield: { wood: 1, fiber: 1 },
  },
  gatherStone: {
    id: "gatherStone",
    name: "Gather Stone",
    cost: {
      time: 2,
      energy: 10,
    },
    resourceYield: { stone: 1 },
    experienceGrant: { strength: 4000 },
  },
  gatherTubers: {
    id: "gatherTubers",
    name: "Gather Tubers",
    cost: {
      time: 3,
      energy: 8,
    },
    resourceYield: { tuber: 5 },
    discoveriesRequired: { find_tubers: 1 },
    knowledgeRequired: 250,
  },
};
