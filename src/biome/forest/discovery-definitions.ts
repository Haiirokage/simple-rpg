import type { ResourceStore } from "../../data/resources/types";

export type DiscoveryType = "berry_patch" | "willow_grove" | "rabbit_trail";

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
    discoveryRange: { min: 60, max: 275 },
    rarity: 0.3,
    reward: { berry: 10 },
  },
  willow_grove: {
    type: "willow_grove",
    maxCount: 3,
    discoveryRange: { min: 140, max: 275 },
    rarity: 0.1,
    reward: { fiber: 2 },
  },
  rabbit_trail: {
    type: "rabbit_trail",
    maxCount: 4,
    discoveryRange: { min: 100, max: 300 },
    rarity: 0.1,
  },
};
