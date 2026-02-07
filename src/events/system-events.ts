import type { SystemEvent } from "./types";

/**
 * System events are automatically triggered by game conditions.
 * These are not random events but rather logged consequences of player actions/state.
 */
export const SYSTEM_EVENTS: Record<string, SystemEvent> = {
  coldDamage: {
    id: "coldDamage",
    name: "Freezing Night",
    category: "system",
    descriptions: [
      "You suffered health damage due to insufficient wood for warmth.",
      "The cold night took a toll on your health as you lacked enough wood.",
      "Without enough wood to keep warm, you lost health to the freezing cold.",
    ],
  },
  starvation: {
    id: "starvation",
    name: "Starvation",
    category: "system",
    descriptions: [
      "You suffered health damage due to starvation.",
      "Lack of food led to a loss of health.",
      "Your health declined as you went without food for too long.",
    ],
  },
  forcedReturn: {
    id: "forcedReturn",
    name: "Returned Home",
    category: "system",
    descriptions: [
      "As night fell, you made your way back home.",
      "Without shelter or supplies for the night, you returned home.",
      "The approaching darkness drove you back to the safety of home.",
    ],
  },
};
