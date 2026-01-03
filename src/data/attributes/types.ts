export type Attributes = "strength" | "constitution";

export type Attribute = {
  level: number;
  exp: number;
};

/**
 * Strength represents pulling force capacity (e.g., for drawing a bow).
 *
 * Population tiers:
 * - 20: Untrained (normal human doing no physical labor)
 * - 40: Novice (light physical labor)
 * - 60: Intermediate (town guard / lumber worker)
 * - 80: Advanced (elite warrior)
 * - 100: Elite (legendary warrior)
 *
 * Two-arm force formula (in lbs):
 * Force = (20 + strength) * sexMultiplier + 0.005 * strength²
 * - Male: sexMultiplier = 2
 * - Female: sexMultiplier = 1
 *
 * Single-arm force (for bows) = Two-arm force / 2
 *
 * Examples (two-arm):
 * - Male str 20: (20 + 20) * 2 + 1.6 = 82 lbs
 * - Male str 60: (20 + 60) * 2 + 18 = 178 lbs
 * - Male str 100: (20 + 100) * 2 + 50 = 290 lbs
 * - Female str 40: (20 + 40) * 1 + 8 = 68 lbs
 * - Female str 100: (20 + 100) * 1 + 50 = 170 lbs
 */

export type AttributeStore = Record<Attributes, Attribute>;
