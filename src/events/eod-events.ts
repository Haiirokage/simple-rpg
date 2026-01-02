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
    descriptions: [
      "This season brought an abundance of berries, boosting your foraging yields.",
      "You found an unusually high number of berries this season, enhancing your harvests.",
      "The berry bushes were particularly fruitful this season, increasing your gathering success.",
    ],
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
    descriptions: [
      "A sudden cold snap increased your wood consumption for warmth.",
      "You faced an unexpected chill, leading to higher wood usage to stay warm.",
      "The drop in temperature forced you to use more wood to keep the cold at bay.",
    ],
  },
  {
    id: "birdRaid",
    name: "Bird Raid",
    category: "eod",
    likelihood: [0, 0, 0.02, 0.03, 0.04, 0.05, 0.05, 0.04, 0.02, 0, 0, 0],
    effects: {
      berryMultiplier: 0,
    },
    descriptions: [
      "A flock of birds raided your berry supplies, leaving you with none.",
      "You returned to find that birds had eaten all your gathered berries.",
      "Your hard-earned berries were taken by a sudden bird raid.",
    ],
  },
];

export const NEUTRAL_EVENTS: EODEvent[] = [];
