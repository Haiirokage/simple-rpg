import type { EODEvent } from "./types";

export const POSITIVE_EVENTS: EODEvent[] = [
  {
    id: "abundantSeason",
    name: "Abundant Season",
    category: "eod",
    likelihood: [0, 0, 0.05, 0.08, 0.1, 0.1, 0.05, 0.08, 0.1, 0.08, 0.05, 0],
    effects: {
      berryMultiplier: 1.5,
    },
  },
];

export const NEGATIVE_EVENTS: EODEvent[] = [
  {
    id: "coldSnap",
    name: "Cold Snap",
    category: "eod",
    likelihood: [0.05, 0.04, 0.02, 0, 0, 0, 0, 0, 0, 0, 0.02, 0.05],
    effects: {
      woodConsumption: 2,
    },
  },
  {
    id: "birdRaid",
    name: "Bird Raid",
    category: "eod",
    likelihood: [0, 0, 0.02, 0.03, 0.04, 0.05, 0.05, 0.04, 0.02, 0, 0, 0],
    effects: {
      berryMultiplier: 0,
    },
  },
];

export const NEUTRAL_EVENTS: EODEvent[] = [];
