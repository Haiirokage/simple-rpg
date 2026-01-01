import type { DiscoveryType } from "../biome/forest/discovery-definitions";
import type { EventLogEntry } from "../data/eventLog/types";
import type { ExplorationEvent } from "./types";

/**
 * Exploration events are logged during exploration activities.
 * These record discoveries, findings, and exploration outcomes.
 */
export const EXPLORATION_EVENTS: Record<DiscoveryType, ExplorationEvent> = {
  berry_patch: {
    id: "berry_patch",
    name: "Found Berry Patch",
    category: "exploration",
  },
  willow_grove: {
    id: "willow_grove",
    name: "Found Willow Grove",
    category: "exploration",
  },
  rabbit_trail: {
    id: "rabbit_trail",
    name: "Discovered Rabbit Trail",
    category: "exploration",
  },
};

export const buildExplorationEventLog = (
  discoveryType: DiscoveryType,
  year: number,
  day: number,
): EventLogEntry => {
  const event = EXPLORATION_EVENTS[discoveryType];
  return { eventId: event.id, category: "exploration", year, day };
};
