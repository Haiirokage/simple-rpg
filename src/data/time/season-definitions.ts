import type { ActionId } from "../../biome/forest/action-definitions";

/**
 * Seasonal weights/modifiers for all mechanics.
 */
export type SeasonWeights = {
  /** Cost in wood per day for heating (units) */
  woodCost: number;
  /** Chance of fiber drop when gathering wood (0-1) */
  fiberDrop: number;
  /** Likelihood of catching rabbit with active trap (0-1) */
  rabbitCatch: number;
};

/**
 * Seasonal mechanics definition.
 */
export type SeasonDefinition = {
  /** Display name of the month/season */
  name: string;
  /** Hour when sunrise occurs (0-23) */
  sunrise: number;
  /** Hour when sunset occurs (0-23) */
  sunset: number;
  /** Grouped seasonal modifiers and mechanics */
  weights: SeasonWeights;
  /** Action yield multipliers by action ID */
  yieldMultiplier: Pick<Record<ActionId, number>, "forage" | "gatherWood">;
};

/**
 * Month definitions by index (0-11).
 * Array index = month number (0 = Frostmoon, 11 = Deepcold)
 * Consolidates all seasonal mechanics in one place for easy tweaking.
 */
export const MONTHS: SeasonDefinition[] = [
  {
    name: "Frostmoon",
    sunrise: 8,
    sunset: 17,
    weights: {
      woodCost: 4,
      fiberDrop: 0.01,
      rabbitCatch: 0.25,
    },
    yieldMultiplier: {
      forage: 0,
      gatherWood: 0.01,
    },
  },
  {
    name: "Snowveil",
    sunrise: 7,
    sunset: 18,
    weights: {
      woodCost: 3,
      fiberDrop: 0.01,
      rabbitCatch: 0.2,
    },
    yieldMultiplier: {
      forage: 0,
      gatherWood: 0.01,
    },
  },
  {
    name: "Greening",
    sunrise: 6,
    sunset: 19,
    weights: {
      woodCost: 2,
      fiberDrop: 0.02,
      rabbitCatch: 0.25,
    },
    yieldMultiplier: {
      forage: 0.2,
      gatherWood: 0.02,
    },
  },
  {
    name: "Bloomtide",
    sunrise: 5,
    sunset: 20,
    weights: {
      woodCost: 1,
      fiberDrop: 0.04,
      rabbitCatch: 0.2,
    },
    yieldMultiplier: {
      forage: 0.5,
      gatherWood: 0.04,
    },
  },
  {
    name: "Sunswept",
    sunrise: 4,
    sunset: 21,
    weights: {
      woodCost: 0,
      fiberDrop: 0.05,
      rabbitCatch: 0.1,
    },
    yieldMultiplier: {
      forage: 0.75,
      gatherWood: 0.05,
    },
  },
  {
    name: "Harvestrise", // June
    sunrise: 3,
    sunset: 22,
    weights: {
      woodCost: 0,
      fiberDrop: 0.05,
      rabbitCatch: 0.08,
    },
    yieldMultiplier: {
      forage: 1.0,
      gatherWood: 0.05,
    },
  },
  {
    name: "Goldleaf" /** July */,
    sunrise: 4,
    sunset: 21,
    weights: {
      woodCost: 0,
      fiberDrop: 0.05,
      rabbitCatch: 0.05,
    },
    yieldMultiplier: {
      forage: 1.0,
      gatherWood: 0.05,
    },
  },
  {
    name: "Skyfall",
    sunrise: 5,
    sunset: 20,
    weights: {
      woodCost: 0,
      fiberDrop: 0.04,
      rabbitCatch: 0.08,
    },
    yieldMultiplier: {
      forage: 1.0,
      gatherWood: 0.04,
    },
  },
  {
    name: "Windmarch",
    sunrise: 6,
    sunset: 19,
    weights: {
      woodCost: 1,
      fiberDrop: 0.02,
      rabbitCatch: 0.15,
    },
    yieldMultiplier: {
      forage: 0.85,
      gatherWood: 0.02,
    },
  },
  {
    name: "Shadowveil",
    sunrise: 7,
    sunset: 18,
    weights: {
      woodCost: 2,
      fiberDrop: 0.02,
      rabbitCatch: 0.2,
    },
    yieldMultiplier: {
      forage: 0.4,
      gatherWood: 0.02,
    },
  },
  {
    name: "Shortdark",
    sunrise: 8,
    sunset: 17,
    weights: {
      woodCost: 2,
      fiberDrop: 0.01,
      rabbitCatch: 0.22,
    },
    yieldMultiplier: {
      forage: 0.2,
      gatherWood: 0.01,
    },
  },
  {
    name: "Deepcold",
    sunrise: 8,
    sunset: 16,
    weights: {
      woodCost: 5,
      fiberDrop: 0.01,
      rabbitCatch: 0.25,
    },
    yieldMultiplier: {
      forage: 0.1,
      gatherWood: 0.01,
    },
  },
];
