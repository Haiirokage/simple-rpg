import type { EncounterFrameId } from "../../data/encounters/types";
import type { ResourceStore } from "../../data/resources/types";

export type DiscoveryType =
  | "berry_patch"
  | "willow_grove"
  | "rabbit_trail"
  | "strong_inspiration"
  | "large_lake";
export type RepeatableDiscoveryType =
  | "deer_tracks"
  | "mysterious_roots"
  | "wolf_sighting"
  | "foraging_npc";
export type AllDiscoveryType = DiscoveryType | RepeatableDiscoveryType;

export interface DiscoveryDefinition {
  type: string;
  rarity: number;
  nightRarity?: number;
  reward?: Partial<ResourceStore>;
  triggerEncounter?: EncounterFrameId;
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
    discoveryRange: { min: 75, max: 300 },
    rarity: 0.3,
    reward: { berry: 10 },
  },
  willow_grove: {
    type: "willow_grove",
    maxCount: 3,
    discoveryRange: { min: 80, max: 265 },
    rarity: 0.1,
    reward: { fiber: 2 },
  },
  rabbit_trail: {
    type: "rabbit_trail",
    maxCount: 4,
    discoveryRange: { min: 120, max: 300 },
    rarity: 0.1,
    nightRarity: 0,
  },
  strong_inspiration: {
    type: "strong_inspiration",
    maxCount: 2,
    discoveryRange: { min: 100, max: 200 },
    rarity: 0.05,
    reward: { stone: 5 },
  },
  large_lake: {
    type: "large_lake",
    maxCount: 1,
    discoveryRange: { min: 180, max: 200 },
    rarity: 0.05,
  },
};

export const REPEATABLE_DISCOVERIES: Record<
  RepeatableDiscoveryType,
  RepeatableDiscoveryDefinition
> = {
  deer_tracks: {
    type: "deer_tracks",
    rarity: 0.12,
    nightRarity: 0,
    knowledgeRequirement: 80,
    triggerEncounter: "deer_tracks_found",
  },
  mysterious_roots: {
    type: "mysterious_roots",
    rarity: 0.07,
    knowledgeRequirement: 120,
    triggerEncounter: "edable_roots",
  },
  wolf_sighting: {
    type: "wolf_sighting",
    rarity: 0.01,
    nightRarity: 0.2,
    knowledgeRequirement: 150,
    triggerEncounter: "wolf_encounter",
  },
  foraging_npc: {
    type: "foraging_npc",
    rarity: 0.12,
    nightRarity: 0.01,
    knowledgeRequirement: 200,
    triggerEncounter: "npc_encounter",
  },
};
