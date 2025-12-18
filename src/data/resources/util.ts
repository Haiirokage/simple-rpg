import type { ResourceStore } from "./types";
import { objectEntries } from "../../util";

/**
 * Check if player can afford a cost and calculate resulting resources.
 *
 * @param cost - Resource cost as Partial<ResourceStore>
 * @param resources - Current resources
 * @returns Object with canAfford boolean and resulting resource state after cost
 */
export const getAffordability = (
  cost: Partial<ResourceStore> = {},
  resources: ResourceStore,
) => {
  const entries = objectEntries(cost);

  const canAfford = entries.every(
    ([key, amount]) => (resources[key] ?? 0) >= amount,
  );

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
 * Format a resource cost as a readable string.
 *
 * @param cost - Resource cost as Partial<ResourceStore>
 * @returns Formatted string like "4 berry, 2 wood" or null if no cost
 */
export const formatResourceCost = (
  cost: Partial<ResourceStore> | undefined,
): string | null => {
  if (!cost) return null;
  return objectEntries(cost)
    .map(([resource, amount]) => `${amount} ${resource}`)
    .join(", ");
};
