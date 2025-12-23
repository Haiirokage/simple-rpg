import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import type { EventLogStore, EventLogEntry } from "./types";

const defaultEventLogStore: EventLogStore = {
  eventLog: [],
};

export const getEventLog = (): EventLogStore => {
  return getStorage<EventLogStore>("EVENT_LOG", defaultEventLogStore);
};

export const setEventLog = (eventLog: EventLogStore) => {
  setStorage("EVENT_LOG", eventLog);
};

export const useEventLog = () => {
  const { data, refetch } = useQuery({
    queryKey: ["EVENT_LOG"],
    queryFn: () => getEventLog(),
    initialData: defaultEventLogStore,
  });

  return {
    eventLog: data,
    refetch,
  };
};

export const useMutateEventLog = () => {
  const { eventLog: store } = useEventLog();

  return useMutation<void, Error, EventLogStore>({
    mutationFn: async (updated) => {
      const merged = { ...store, ...updated };
      return setEventLog(merged);
    },
    onMutate: (updated, context) => {
      const merged = { ...store, ...updated };
      context.client.setQueryData(["EVENT_LOG"], merged);
    },
  });
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
