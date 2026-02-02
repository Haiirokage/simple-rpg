import { useDataQuery, useUpdateData } from "../util";
import { DAYS_IN_MONTH } from "./season-definitions";

export type TimeStats = {
  time: number;
  day: number;
  year: number;
};

const defaultTimeStats: TimeStats = {
  time: 6,
  /** 0-359, but displayed as 1-30 */
  day: 3 * DAYS_IN_MONTH,
  year: 1,
};

export const useTime = () => {
  const { data } = useDataQuery<TimeStats>("TIME_STATS", defaultTimeStats);
  return data;
};

export const useUpdateTime = () => {
  const { mutate } = useUpdateData<TimeStats>("TIME_STATS", defaultTimeStats);
  return mutate;
};

export const useAdvanceTime = () => {
  const timeStats = useTime();
  const updateTime = useUpdateTime();

  return (hours: number) => {
    updateTime({ time: timeStats.time + hours });
  };
};
