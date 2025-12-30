import { shuffle } from "lodash";
import { FOREST_DISCOVERIES } from "../../biome/forest/discovery-definitions";
import { objectKeys } from "../../util";
import { calculateDiscoveryChance } from "./hooks";
import type { DiscoveriesStore } from "./types";

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
    const chance = calculateDiscoveryChance(knowledgeLevel, definition, discoveredCount);

    if (Math.random() < chance) {
      return discoveryType;
    }
  }

  return undefined;
};
