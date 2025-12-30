import type { ResourceStore } from "../../data/resources/types";

export type DiscoveryType = "berry_patch" | "willow_grove";

export interface DiscoveryDefinition {
  type: DiscoveryType;
  maxCount: number;
  discoveryRange: { min: number; max: number };
  rarity: number;
  reward?: Partial<ResourceStore>;
}

export const FOREST_DISCOVERIES: Record<DiscoveryType, DiscoveryDefinition> = {
  berry_patch: {
    type: "berry_patch",
    maxCount: 5,
    discoveryRange: { min: 50, max: 275 },
    rarity: 0.3,
    reward: { berry: 10 },
  },
  willow_grove: {
    type: "willow_grove",
    maxCount: 3,
    discoveryRange: { min: 150, max: 275 },
    rarity: 0.1,
    reward: { fiber: 2 },
  },
};
