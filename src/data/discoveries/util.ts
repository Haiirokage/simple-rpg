import { shuffle } from "lodash";
import { FOREST_DISCOVERIES } from "../../biome/forest/discovery-definitions";
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
 * Shuffles the list and checks each discovery in order.
 * Returns the first discovery found, or null if none found.
 */
export const pickRandomDiscovery = (
  knowledgeLevel: number,
  discoveries: DiscoveriesStore,
): keyof typeof FOREST_DISCOVERIES | undefined => {
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

    const chance = calculateDiscoveryChance(knowledgeLevel, definition, discoveredCount);

    if (Math.random() < chance) {
      return discoveryType;
    }
  }

  return undefined;
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
