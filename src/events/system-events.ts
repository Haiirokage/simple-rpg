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
  },
  starvation: {
    id: "starvation",
    name: "Starvation",
    category: "system",
  },
};
