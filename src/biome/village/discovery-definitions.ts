import type {
  UnlockableDiscoveryDefinition,
  RepeatableDiscoveryDefinition,
} from "../discovery-types";

export type VillageUnlockable = "town_square";

export type VillageRepeatable = "village_test";

export const VILLAGE_DISCOVERIES: Record<VillageUnlockable, UnlockableDiscoveryDefinition> = {
  town_square: {
    type: "town_square",
    maxCount: 1,
    discoveryRange: { min: 0, max: 50 },
    rarity: 0.5,
  },
};

export const VILLAGE_REPEATABLE_DISCOVERIES: Record<
  VillageRepeatable,
  RepeatableDiscoveryDefinition
> = {
  village_test: {
    type: "village_test",
    rarity: 0.1,
    knowledgeRequirement: 0,
  },
};
