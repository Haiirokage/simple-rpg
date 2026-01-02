import type { HomeUpgradeKeys } from "./types";
import type { ResourceStore } from "../resources/types";
import type { DiscoveryType } from "../../biome/forest/discovery-definitions";

export type HomeUpgradeDefinition = {
  key: HomeUpgradeKeys;
  name: string;
  timeCost: number;
  resourceCost: Partial<ResourceStore>;
  discoveriesRequired?: Partial<Record<DiscoveryType, number>>;
};

export const HOME_UPGRADES: HomeUpgradeDefinition[] = [
  {
    key: "smoker",
    name: "Smoker",
    timeCost: 6,
    resourceCost: { stone: 25 },
  },
  {
    key: "stoneGym",
    name: "Stone Gym",
    timeCost: 6,
    resourceCost: { stone: 30, fiber: 10, wood: 20 },
    discoveriesRequired: { strong_inspiration: 1 },
  },
];
