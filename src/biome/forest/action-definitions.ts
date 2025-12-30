import type { ResourceStore } from "../../data/resources/types";
import type { DiscoveryType } from "./discovery-definitions";

export type ActionId = "forage" | "gatherWood";

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
  discoveriesRequired?: Partial<Record<DiscoveryType, number>>;
}

export const FOREST_ACTIONS: Record<ActionId, ActionDefinition> = {
  forage: {
    id: "forage",
    name: "Forage for Berries",
    cost: {
      time: 3,
      energy: 5,
    },
    resourceYield: { berry: 20 },
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
};
