/**
 * Resource consumption rates and calculations.
 * Centralized location for consumption metrics to support
 * future variations (e.g., by season, difficulty, or events).
 */

import type { ResourceKeys } from "./types";
import { FOOD_STORAGE } from "./food-definitions";

/**
 * Apply decay to a resource based on its decay rate.
 * If decay >= 1: subtract floor(decay) units.
 * If decay < 1: probabilistic chance to lose 1 unit.
 */
export const applyResourceDecay = (
  resourceKey: ResourceKeys,
  amount: number,
  /** Amount to reduce decay rate by (e.g., 0.01 for pantry) */
  decayReduction = 0,
): number => {
  const def = FOOD_STORAGE.find((d) => d.key === resourceKey);
  if (!def || def.decayRate === 0) return amount; // no decay

  const effectiveDecayRate = Math.max(def.decayRate - decayReduction, 0.01);
  const decay = amount * effectiveDecayRate;
  if (decay >= 1) {
    return amount - Math.floor(decay);
  }
  // decay < 1: decay% chance to lose 1 unit
  return Math.random() < decay ? amount - 1 : amount;
};
