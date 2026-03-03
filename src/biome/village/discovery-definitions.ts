import type {
  UnlockableDiscoveryDefinition,
  RepeatableDiscoveryDefinition,
} from "../discovery-types";

export type VillageUnlockable = "village_tavern" | "village_blacksmith" | "village_fight_club";

export type VillageRepeatable = "repair_job" | "hide_and_seek";

export const VILLAGE_DISCOVERIES: Record<VillageUnlockable, UnlockableDiscoveryDefinition> = {
  village_tavern: {
    type: "village_tavern",
    maxCount: 1,
    discoveryRange: { min: 0, max: 50 },
    rarity: 0.1,
  },
  village_blacksmith: {
    type: "village_blacksmith",
    maxCount: 1,
    discoveryRange: { min: 10, max: 50 },
    rarity: 0.1,
  },
  village_fight_club: {
    type: "village_fight_club",
    maxCount: 1,
    discoveryRange: { min: 15, max: 50 },
    rarity: 0.01,
    nightRarity: 0.15,
  },
};

export const VILLAGE_REPEATABLE_DISCOVERIES: Record<
  VillageRepeatable,
  RepeatableDiscoveryDefinition
> = {
  repair_job: {
    type: "repair_job",
    rarity: 0.3,
    knowledgeRequirement: 0,
    triggerEncounter: "repair_job_offer",
  },
  hide_and_seek: {
    type: "hide_and_seek",
    rarity: 0.4,
    knowledgeRequirement: 5,
    triggerEncounter: ["hide_and_seek_seeker", "hide_and_seek_hider"],
  },
};
