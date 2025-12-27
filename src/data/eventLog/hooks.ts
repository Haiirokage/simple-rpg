import { useDataQuery, useUpdateData } from "../util";
import type { EventLogStore, EventLogEntry } from "./types";

const defaultEventLogStore: EventLogStore = {
  eventLog: [],
};

export const useEventLog = () => {
  const { data, refetch } = useDataQuery<EventLogStore>("EVENT_LOG", defaultEventLogStore);

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
