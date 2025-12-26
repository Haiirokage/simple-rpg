import type { Event } from "./eod-events";

/**
 * System events are automatically triggered by game conditions.
 * These are not random events but rather logged consequences of player actions/state.
 */
export const SYSTEM_EVENTS: Record<string, Event> = {
  coldDamage: {
    id: "coldDamage",
    name: "Freezing Night",
    likelihood: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    effects: {},
  },
  starvation: {
    id: "starvation",
    name: "Starvation",
    likelihood: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    effects: {},
  },
};
