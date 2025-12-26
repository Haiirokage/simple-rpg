type EventEffect = "berryMultiplier" | "woodConsumption";

type MonthlyChances = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type Event = {
  id: string;
  name: string;
  likelihood: MonthlyChances; // 0-1 probability per month, exactly 12 values
  effects: Partial<Record<EventEffect, number>>;
};

export const POSITIVE_EVENTS: Event[] = [
  {
    id: "abundantSeason",
    name: "Abundant Season",
    likelihood: [0, 0, 0.05, 0.08, 0.1, 0.1, 0.05, 0.08, 0.1, 0.08, 0.05, 0],
    effects: {
      berryMultiplier: 1.5,
    },
  },
];

export const NEGATIVE_EVENTS: Event[] = [
  {
    id: "coldSnap",
    name: "Cold Snap",
    likelihood: [0.05, 0.04, 0.02, 0, 0, 0, 0, 0, 0, 0, 0.02, 0.05],
    effects: {
      woodConsumption: 2,
    },
  },
  {
    id: "birdRaid",
    name: "Bird Raid",
    likelihood: [0, 0, 0.02, 0.03, 0.04, 0.05, 0.05, 0.04, 0.02, 0, 0, 0],
    effects: {
      berryMultiplier: 0,
    },
  },
];

export const NEUTRAL_EVENTS: Event[] = [];
