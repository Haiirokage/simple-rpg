import type { EncounterFrameId } from "../data/encounters/types";
import type { ResourceStore } from "../data/resources/types";
import type { ForestUnlockable, ForestRepeatable } from "./forest/discovery-definitions";
import type { VillageUnlockable, VillageRepeatable } from "./village/discovery-definitions";

export const Biome = {
  forest: "forest",
  village: "village",
} as const;

export type BiomeType = (typeof Biome)[keyof typeof Biome];

// Extra unlockables (no definitions, triggered by other mechanics)
export type ExtraUnlockables = "successful_hunt" | "failed_hunt" | "find_tubers" | "village_rumor";

// Biome unlockables (have definitions)
export type AllBiomeUnlockables = ForestUnlockable | VillageUnlockable;

// All unlockables = stored in discoveryStore
export type AllUnlockables = AllBiomeUnlockables | ExtraUnlockables;

// All repeatables = not stored
export type AllRepeatables = ForestRepeatable | VillageRepeatable;

// Everything = loggable
export type AllDiscoveries = AllUnlockables | AllRepeatables;

interface BaseDiscoveryDefinition {
  rarity: number;
  nightRarity?: number;
  reward?: Partial<ResourceStore>;
  triggerEncounter?: EncounterFrameId;
}

export interface UnlockableDiscoveryDefinition extends BaseDiscoveryDefinition {
  type: AllBiomeUnlockables;
  maxCount: number;
  discoveryRange: { min: number; max: number };
}

export interface RepeatableDiscoveryDefinition extends BaseDiscoveryDefinition {
  type: AllRepeatables;
  knowledgeRequirement: number;
}
