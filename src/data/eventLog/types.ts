import type { NEGATIVE_EVENTS, NEUTRAL_EVENTS, POSITIVE_EVENTS } from "../../events/eod-events";
import type { SYSTEM_EVENTS } from "../../events/system-events";
import type { EventCategory } from "../../events/types";

export type EventId =
  | keyof typeof SYSTEM_EVENTS
  | (typeof POSITIVE_EVENTS | typeof NEGATIVE_EVENTS | typeof NEUTRAL_EVENTS)[number]["id"];

export type EventLogEntry = {
  year: number;
  day: number;
  eventId: EventId;
  category: EventCategory;
  descriptionIndex?: number; // Index into the event's description array for hover tooltip
};

export type EventLogStore = {
  eventLog: EventLogEntry[];
};
