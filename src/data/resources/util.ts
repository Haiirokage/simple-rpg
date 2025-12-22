import type { ResourceStore } from "./types";
import type { ResourceKeys } from "./types";
import { objectEntries } from "../../util";
import { FOOD_STORAGE } from "./food-definitions";
import { MATERIAL_STORAGE } from "./material-definitions";
import type { StructuresStore } from "../structures/hooks";

/**
 * Check if player can afford a cost and calculate resulting resources.
 *
 * @param cost - Resource cost as Partial<ResourceStore>
 * @param resources - Current resources
 * @returns Object with canAfford boolean and resulting resource state after cost
 */
export const getAffordability = (cost: Partial<ResourceStore> = {}, resources: ResourceStore) => {
  const entries = objectEntries(cost);

  const canAfford = entries.every(([key, amount]) => (resources[key] ?? 0) >= amount);

  const resourceResult = entries.reduce(
    (acc, [key, amount]) => ({
      ...acc,
      [key]: (resources[key] ?? 0) - amount,
    }),
    {} as Partial<ResourceStore>,
  );

  return { canAfford, resourceResult };
};

/**
 * Get storage capacity for a resource, checking both food and material definitions.
 *
 * @param resourceKey - The resource to check capacity for
 * @param pantries - Number of pantries (for food storage)
 * @returns Maximum capacity for the resource
 */
export const getStorageCapacity = (
  resourceKey: ResourceKeys,
  structures: Omit<StructuresStore, "plots">,
): number => {
  // Check food storage first
  const def =
    FOOD_STORAGE.find((d) => d.key === resourceKey) ||
    MATERIAL_STORAGE.find((d) => d.key === resourceKey);
  console.log(def);
  if (def) {
    if ("capacityPerPantry" in def) {
      return def.baseCapacity + def.capacityPerPantry * structures.pantry;
    }
    if ("capacityPerShed" in def) {
      return def.baseCapacity + (def.capacityPerShed || 0) * structures.woodShed;
    }
    if ("capacityPerStonePile" in def) {
      return def.baseCapacity + (def.capacityPerStonePile || 0) * structures.stonePile;
    }
    return def.baseCapacity;
  }

  return Infinity; // unlimited if not in definitions
};

/**
 * Format a resource cost as a readable string.
 *
 * @param cost - Resource cost as Partial<ResourceStore>
 * @returns Formatted string like "4 berry, 2 wood" or null if no cost
 */
export const formatResourceCost = (cost: Partial<ResourceStore> | undefined): string | null => {
  if (!cost) return null;
  return objectEntries(cost)
    .map(([resource, amount]) => `${amount} ${resource}`)
    .join(", ");
};
