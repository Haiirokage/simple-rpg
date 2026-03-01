import type { ResourceStore } from "./types";
import type { ResourceKeys } from "./types";
import { objectEntries } from "../../util";
import { FOOD_STORAGE } from "./food-definitions";
import { MATERIAL_STORAGE } from "./material-definitions";
import type { StructuresStore } from "../structures/hooks";
import type { ComponentStore } from "../craftComponents/types";
import { getTotalCraftComponentsWeight } from "../craftComponents/util";

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
    if ("capacityPerWorkshop" in def) {
      return def.baseCapacity + (def.capacityPerWorkshop || 0) * structures.workshop;
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

/**
 * Check if all required resources have been discovered (exist in persisted state)
 */
export const hasDiscoveredResources = (
  requiredResources: Partial<ResourceStore>,
  persistedResources: Partial<ResourceStore>,
): boolean => {
  return objectEntries(requiredResources).every(([key]) => key in persistedResources);
};

/**
 * Get the weight of a single unit of a resource.
 * Weight is derived from baseCapacity: weight = 1 / baseCapacity.
 * Resources with baseCapacity 0 are weightless.
 */
export const getResourceWeight = (resourceKey: ResourceKeys): number => {
  const def =
    FOOD_STORAGE.find((d) => d.key === resourceKey) ||
    MATERIAL_STORAGE.find((d) => d.key === resourceKey);

  if (!def || def.baseCapacity === 0) return 0;
  return 1 / def.baseCapacity;
};

/**
 * Get total weight of an exploration inventory, including craft components.
 */
export const getInventoryWeight = (
  inventory: Partial<ResourceStore>,
  craftComponents: ComponentStore,
): number => {
  const resourceWeight = objectEntries(inventory).reduce((total, [key, amount]) => {
    return total + getResourceWeight(key) * amount;
  }, 0);
  return resourceWeight + getTotalCraftComponentsWeight(craftComponents);
};

/**
 * Get carry capacity based on force (strength-derived).
 * Capacity = force / 50, rounded to 1 decimal place.
 */
export const getCarryCapacity = (force: number): number => {
  return Math.round((force / 40) * 10) / 10;
};
