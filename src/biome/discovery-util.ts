import { shuffle } from "lodash";
import { useMemo } from "preact/hooks";
import { FOREST_DISCOVERIES, REPEATABLE_DISCOVERIES } from "./forest/discovery-definitions";
import {
  VILLAGE_DISCOVERIES,
  VILLAGE_REPEATABLE_DISCOVERIES,
} from "./village/discovery-definitions";
import type {
  UnlockableDiscoveryDefinition,
  RepeatableDiscoveryDefinition,
  BiomeType,
  AllBiomeUnlockables,
  AllRepeatables,
  AllUnlockables,
} from "./discovery-types";
import { objectEntries } from "../util";
import type { DiscoveriesStore } from "../data/discoveries/types";

type BiomeDiscoveries = {
  unlockable: Partial<Record<AllBiomeUnlockables, UnlockableDiscoveryDefinition>>;
  repeatable: Partial<Record<AllRepeatables, RepeatableDiscoveryDefinition>>;
};

export const BIOME_DISCOVERIES: Record<BiomeType, BiomeDiscoveries> = {
  forest: { unlockable: FOREST_DISCOVERIES, repeatable: REPEATABLE_DISCOVERIES },
  village: { unlockable: VILLAGE_DISCOVERIES, repeatable: VILLAGE_REPEATABLE_DISCOVERIES },
};

export const calculateDiscoveryChance = (
  currentKnowledge: number,
  definition: UnlockableDiscoveryDefinition,
  discovered: number,
  steepness = 0.16,
): number => {
  // expectedKnowledge increases as you find more
  // maxCount items spread across range means (maxCount - 1) intervals
  const knowledgePerDiscovery =
    definition.maxCount > 1
      ? (definition.discoveryRange.max - definition.discoveryRange.min) / (definition.maxCount - 1)
      : 0;
  const expectedKnowledge = definition.discoveryRange.min + discovered * knowledgePerDiscovery;

  // Sigmoid centered at expectedKnowledge
  // At expected: chance = rarity
  // At expected + 25: approaches 2 * rarity (capped at 1.0)
  // At expected - 25: approaches rarity / 50
  const diff = currentKnowledge - expectedKnowledge;
  const chance = (definition.rarity * 2) / (1 + Math.exp(-steepness * diff));

  return Math.min(Math.max(chance, 0), 1); // Clamp to 0-1
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
    console.log("discoverytype: ", definition);
    const discoveredCount = discoveries[discoveryType] || 0;
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
