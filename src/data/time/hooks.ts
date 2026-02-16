import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import { DAYS_IN_MONTH } from "./season-definitions";

export type TimeStats = {
  time: number;
  day: number;
  year: number;
  isResting?: boolean;
};

const defaultTimeStats: TimeStats = {
  time: 6,
  /** 0-359, but displayed as 1-30 */
  day: 3 * DAYS_IN_MONTH,
  year: 1,
};

export const timeQuery = makeDataQuery("TIME_STATS", defaultTimeStats);

export const useTime = () => {
  const { data } = useDefinedQuery(timeQuery);
  return data;
};

export const useUpdateTime = () => {
  const { mutate } = useUpdateData<TimeStats>("TIME_STATS", defaultTimeStats);
  return mutate;
};

export const useAdvanceTime = () => {
  const timeStats = useTime();
  const updateTime = useUpdateTime();

  return (hours: number, isResting = false) => {
    updateTime({ time: timeStats.time + hours, isResting });
  };
};
