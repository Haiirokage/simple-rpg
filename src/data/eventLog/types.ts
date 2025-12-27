import type { NEGATIVE_EVENTS, NEUTRAL_EVENTS, POSITIVE_EVENTS } from "../../events/eod-events";
import type { SYSTEM_EVENTS } from "../../events/system-events";

export type EventId =
  | keyof typeof SYSTEM_EVENTS
  | (typeof POSITIVE_EVENTS | typeof NEGATIVE_EVENTS | typeof NEUTRAL_EVENTS)[number]["id"];

export type EventLogEntry = {
  year: number;
  day: number;
  eventId: EventId;
};

export type EventLogStore = {
  eventLog: EventLogEntry[];
};
