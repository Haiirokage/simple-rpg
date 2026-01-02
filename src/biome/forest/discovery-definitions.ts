import type { ResourceStore } from "../../data/resources/types";

export type DiscoveryType = "berry_patch" | "willow_grove" | "rabbit_trail";
export type RepeatableDiscoveryType = "deer_tracks";
export type AllDiscoveryType = DiscoveryType | RepeatableDiscoveryType;

export interface DiscoveryDefinition {
  type: string;
  rarity: number;
  reward?: Partial<ResourceStore>;
}

export interface UnlockableDiscoveryDefinition extends DiscoveryDefinition {
  maxCount: number;
  discoveryRange: { min: number; max: number };
}

export interface RepeatableDiscoveryDefinition extends DiscoveryDefinition {
  knowledgeRequirement: number;
}

export const FOREST_DISCOVERIES: Record<DiscoveryType, UnlockableDiscoveryDefinition> = {
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
    discoveryRange: { min: 100, max: 275 },
    rarity: 0.1,
    reward: { fiber: 2 },
  },
  rabbit_trail: {
    type: "rabbit_trail",
    maxCount: 4,
    discoveryRange: { min: 140, max: 300 },
    rarity: 0.1,
  },
};

export const REPEATABLE_DISCOVERIES: Record<
  RepeatableDiscoveryType,
  RepeatableDiscoveryDefinition
> = {
  deer_tracks: {
    type: "deer_tracks",
    rarity: 0.08,
    knowledgeRequirement: 80,
  },
};
