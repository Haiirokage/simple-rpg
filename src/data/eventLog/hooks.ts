import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import type { EventLogStore, EventLogEntry } from "./types";

const defaultEventLogStore: EventLogStore = {
  eventLog: [],
};

export const eventLogQuery = makeDataQuery("EVENT_LOG", defaultEventLogStore);

export const useEventLog = () => {
  const { data, refetch } = useDefinedQuery(eventLogQuery);

  return {
    eventLog: data,
    refetch,
  };
};

export const useMutateEventLog = () => {
  return useUpdateData<EventLogStore>("EVENT_LOG", defaultEventLogStore);
};

export const useAddEventLogEntry = () => {
  const { eventLog: store } = useEventLog();
  const { mutate } = useMutateEventLog();

  const addEntry = (entry: EventLogEntry) => {
    const updated = {
      eventLog: [...store.eventLog, entry],
    };
    mutate(updated);
  };

  return addEntry;
};
