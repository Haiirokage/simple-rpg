/**
 * Seasonal weights/modifiers for all mechanics.
 */
export type SeasonWeights = {
  /** Multiplier for berry gathering (0-1) */
  berryIncome: number;
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
      berryIncome: 0,
      woodCost: 4,
      fiberDrop: 0.01,
      rabbitCatch: 0.25,
    },
  },
  {
    name: "Snowveil",
    sunrise: 7,
    sunset: 18,
    weights: {
      berryIncome: 0,
      woodCost: 3,
      fiberDrop: 0.01,
      rabbitCatch: 0.2,
    },
  },
  {
    name: "Greening",
    sunrise: 6,
    sunset: 19,
    weights: {
      berryIncome: 0.2,
      woodCost: 2,
      fiberDrop: 0.02,
      rabbitCatch: 0.25,
    },
  },
  {
    name: "Bloomtide",
    sunrise: 5,
    sunset: 20,
    weights: {
      berryIncome: 0.5,
      woodCost: 1,
      fiberDrop: 0.04,
      rabbitCatch: 0.2,
    },
  },
  {
    name: "Sunswept",
    sunrise: 4,
    sunset: 21,
    weights: {
      berryIncome: 0.75,
      woodCost: 0,
      fiberDrop: 0.05,
      rabbitCatch: 0.1,
    },
  },
  {
    name: "Harvestrise", // June
    sunrise: 3,
    sunset: 22,
    weights: {
      berryIncome: 1.0,
      woodCost: 0,
      fiberDrop: 0.05,
      rabbitCatch: 0.08,
    },
  },
  {
    name: "Goldleaf" /** July */,
    sunrise: 4,
    sunset: 21,
    weights: {
      berryIncome: 1.0,
      woodCost: 0,
      fiberDrop: 0.05,
      rabbitCatch: 0.05,
    },
  },
  {
    name: "Skyfall",
    sunrise: 5,
    sunset: 20,
    weights: {
      berryIncome: 1.0,
      woodCost: 0,
      fiberDrop: 0.04,
      rabbitCatch: 0.08,
    },
  },
  {
    name: "Windmarch",
    sunrise: 6,
    sunset: 19,
    weights: {
      berryIncome: 0.85,
      woodCost: 1,
      fiberDrop: 0.02,
      rabbitCatch: 0.15,
    },
  },
  {
    name: "Shadowveil",
    sunrise: 7,
    sunset: 18,
    weights: {
      berryIncome: 0.4,
      woodCost: 2,
      fiberDrop: 0.02,
      rabbitCatch: 0.2,
    },
  },
  {
    name: "Shortdark",
    sunrise: 8,
    sunset: 17,
    weights: {
      berryIncome: 0.2,
      woodCost: 2,
      fiberDrop: 0.01,
      rabbitCatch: 0.22,
    },
  },
  {
    name: "Deepcold",
    sunrise: 8,
    sunset: 16,
    weights: {
      berryIncome: 0.1,
      woodCost: 5,
      fiberDrop: 0.01,
      rabbitCatch: 0.25,
    },
  },
];
