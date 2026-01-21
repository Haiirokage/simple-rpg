import { shuffle } from "lodash";
import {
  FOREST_DISCOVERIES,
  REPEATABLE_DISCOVERIES,
  type DiscoveryType,
  type RepeatableDiscoveryType,
} from "../../biome/forest/discovery-definitions";
import { objectEntries, objectKeys } from "../../util";
import { calculateDiscoveryChance } from "./hooks";
import type { DiscoveriesStore } from "./types";
import { useMemo } from "preact/hooks";

/**
 * TODO: Make biome-agnostic once multiple biomes exist
 * Currently hardcoded to forest discoveries. Should accept discoveries parameter.
 */

/**
 * Pick a random discovery to attempt finding.
 * First tries unlockable discoveries, then falls back to repeatable discoveries if none found.
 * Returns the first discovery found, or null if none found.
 */
export const pickRandomDiscovery = (
  knowledgeLevel: number,
  discoveries: DiscoveriesStore,
  discoveryMultiplier = 1,
): { discovery?: DiscoveryType; repeatable?: RepeatableDiscoveryType } => {
  // Get all discovery types and shuffle
  const discoveryTypes = objectKeys(FOREST_DISCOVERIES);
  const shuffled = shuffle(discoveryTypes);

  // Check each discovery in random order
  for (const discoveryType of shuffled) {
    const definition = FOREST_DISCOVERIES[discoveryType];
    const discoveredCount = discoveries[discoveryType] || 0;

    // Skip if already at max
    if (discoveredCount >= definition.maxCount) {
      continue;
    }
    console.log(discoveryMultiplier);
    const chance =
      calculateDiscoveryChance(knowledgeLevel, definition, discoveredCount) * discoveryMultiplier;

    if (Math.random() < chance) {
      return { discovery: discoveryType };
    }
  }

  // Fall back to repeatable discoveries
  const repeatableTypes = objectKeys(REPEATABLE_DISCOVERIES);
  const shuffledRepeatable = shuffle(repeatableTypes);

  for (const discoveryType of shuffledRepeatable) {
    const definition = REPEATABLE_DISCOVERIES[discoveryType];

    // Check if player meets knowledge requirement
    if (knowledgeLevel < definition.knowledgeRequirement) {
      continue;
    }

    // Simple chance check for repeatable discoveries
    if (Math.random() < definition.rarity) {
      return { repeatable: discoveryType };
    }
  }

  return {};
};

/**
 * Hook to check if there are any discoveries with at least a minimum chance of being found.
 * Useful for determining if exploration is worth attempting.
 */
export const useHasViableDiscoveries = (
  knowledgeLevel: number,
  discoveries: DiscoveriesStore,
  minChance: number = 0.02,
): boolean => {
  return useMemo(() => {
    return objectEntries(FOREST_DISCOVERIES).some(([discoveryType, discovery]) => {
      const discoveredCount = discoveries[discoveryType] || 0;
      const chance = calculateDiscoveryChance(knowledgeLevel, discovery, discoveredCount);

      return chance >= minChance;
    });
  }, [knowledgeLevel, discoveries, minChance]);
};
