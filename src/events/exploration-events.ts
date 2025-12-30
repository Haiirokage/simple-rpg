import type { ExplorationEvent } from "./types";

/**
 * Exploration events are logged during exploration activities.
 * These record discoveries, findings, and exploration outcomes.
 */
export const EXPLORATION_EVENTS: Record<string, ExplorationEvent> = {
  foundBerryPatch: {
    id: "foundBerryPatch",
    name: "Found Berry Patch",
    category: "exploration",
  },
  foundWillowGrove: {
    id: "foundWillowGrove",
    name: "Found Willow Grove",
    category: "exploration",
  },
};
