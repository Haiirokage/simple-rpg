import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import { getMonthName } from "./season-util";

export type TimeStats = {
  time: number;
  day: number;
  year: number;
};

const defaultTimeStats: TimeStats = {
  time: 6,
  /** 0-359, but displayed as 1-30 */
  day: 3 * 30,
  year: 1,
};

/**
 * Get formatted date string from day number (e.g., "February 2")
 */
export const getDate = (day: number): string => {
  const dayInMonth = (day % 30) + 1;
  return `${getMonthName(day)} ${dayInMonth}`;
};

export const getTime = (): TimeStats => {
  return getStorage<TimeStats>("TIME_STATS", defaultTimeStats);
};

export const setTime = (timeStats: TimeStats) => {
  setStorage("TIME_STATS", timeStats);
};

export const useTime = () => {
  const { data } = useQuery({
    queryKey: ["TIME_STATS"],
    queryFn: () => getTime(),
    initialData: defaultTimeStats,
  });
  return data;
};

export const useUpdateTime = () => {
  const timeStats = useTime();
  const { mutate } = useMutation<void, Error, Partial<TimeStats>>({
    mutationFn: async (updates) => setTime({ ...timeStats, ...updates }),
    onMutate: (updates, context) => {
      context.client.setQueryData(["TIME_STATS"], { ...timeStats, ...updates });
    },
  });
  return mutate;
};
