export type EventLogEntry = {
  year: number;
  day: number;
  eventId: string;
};

export type EventLogStore = {
  eventLog: EventLogEntry[];
};
