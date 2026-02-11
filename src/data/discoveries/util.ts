import { shuffle } from "lodash";
import {
  FOREST_DISCOVERIES,
  REPEATABLE_DISCOVERIES,
} from "../../biome/forest/discovery-definitions";
import {
  VILLAGE_DISCOVERIES,
  VILLAGE_REPEATABLE_DISCOVERIES,
} from "../../biome/village/discovery-definitions";
import type {
  UnlockableDiscoveryDefinition,
  RepeatableDiscoveryDefinition,
  BiomeType,
  AllBiomeUnlockables,
  AllRepeatables,
  AllUnlockables,
} from "../../biome/discovery-types";
import { objectEntries } from "../../util";
import { calculateDiscoveryChance } from "./hooks";
import type { DiscoveriesStore } from "./types";
import { useMemo } from "preact/hooks";

type BiomeDiscoveries = {
  unlockable: Partial<Record<AllBiomeUnlockables, UnlockableDiscoveryDefinition>>;
  repeatable: Partial<Record<AllRepeatables, RepeatableDiscoveryDefinition>>;
};

const BIOME_DISCOVERIES: Record<BiomeType, BiomeDiscoveries> = {
  forest: { unlockable: FOREST_DISCOVERIES, repeatable: REPEATABLE_DISCOVERIES },
  village: { unlockable: VILLAGE_DISCOVERIES, repeatable: VILLAGE_REPEATABLE_DISCOVERIES },
};

/** Check if all required discovery counts are met. */
export const meetsDiscoveryRequirements = (
  requirements: Partial<Record<AllUnlockables, number>> | undefined,
  discoveries: DiscoveriesStore,
) => !requirements || objectEntries(requirements).every(([key, req]) => discoveries[key] >= req);

type DiscoveryResult =
  | { discovery: UnlockableDiscoveryDefinition; repeatable?: never }
  | { discovery?: never; repeatable: RepeatableDiscoveryDefinition }
  | { discovery?: never; repeatable?: never };

/**
 * Pick a random discovery to attempt finding.
 * First tries unlockable discoveries, then falls back to repeatable discoveries if none found.
 * Returns the first discovery found, or null if none found.
 */
export const pickRandomDiscovery = <T extends BiomeType>(
  biome: T,
  knowledgeLevel: number,
  discoveries: DiscoveriesStore,
  discoveryMultiplier = 1,
  night = false,
): DiscoveryResult => {
  const { unlockable, repeatable } = BIOME_DISCOVERIES[biome];

  // Get all discovery entries and shuffle
  const discoveryEntries = shuffle(objectEntries(unlockable));

  // Check each discovery in random order
  for (const [discoveryType, definition] of discoveryEntries) {
    const discoveredCount = discoveries[discoveryType];
    // Skip if already at max
    if (discoveredCount >= definition.maxCount) {
      continue;
    }
    const rarity = night ? (definition.nightRarity ?? definition.rarity) : definition.rarity;
    const chance =
      calculateDiscoveryChance(knowledgeLevel, { ...definition, rarity }, discoveredCount) *
      discoveryMultiplier;

    if (Math.random() < chance) {
      return { discovery: definition };
    }
  }

  // Fall back to repeatable discoveries
  const repeatableDefinitions = shuffle(Object.values(repeatable));

  for (const definition of repeatableDefinitions) {
    if (!definition || knowledgeLevel < definition.knowledgeRequirement) {
      continue;
    }

    const rarity = night ? (definition.nightRarity ?? definition.rarity) : definition.rarity;
    if (Math.random() < rarity) {
      return { repeatable: definition };
    }
  }

  return {};
};

/**
 * Hook to check if there are any discoveries with at least a minimum chance of being found.
 * Useful for determining if exploration is worth attempting.
 */
export const useHasViableDiscoveries = (
  biome: BiomeType,
  knowledgeLevel: number,
  discoveries: DiscoveriesStore,
  minChance = 0.02,
): boolean => {
  return useMemo(() => {
    const { unlockable } = BIOME_DISCOVERIES[biome];
    return objectEntries(unlockable).some(([discoveryType, definition]) => {
      const discoveredCount = discoveries[discoveryType];
      const chance = calculateDiscoveryChance(knowledgeLevel, definition, discoveredCount);
      return chance >= minChance;
    });
  }, [biome, knowledgeLevel, discoveries, minChance]);
};
