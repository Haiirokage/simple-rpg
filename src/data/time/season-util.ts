import { MONTHS, type SeasonDefinition } from "./season-definitions";
import inRange from "lodash/inRange";

/**
 * Get season definition by day number (0-359)
 * @param day - Day number (0-359), wraps around automatically
 * @returns Season definition for the given day
 */
export const getSeasonByDay = (day: number): SeasonDefinition => {
  const month = Math.floor(day / 30);
  return MONTHS[month % 12];
};

/**
 * Get month name from day number
 */
export const getMonthName = (day: number): string => {
  const season = getSeasonByDay(day);
  return season.name;
};

/**
 * Get formatted date string from day number (e.g., "February 2")
 */
export const getDate = (day: number, short = false): string => {
  const dayInMonth = (day % 30) + 1;
  const month = Math.floor(day / 30) + 1;
  const monthStr = short ? String(month).padStart(2, "0") : getMonthName(day);
  const dayStr = String(dayInMonth).padStart(2, "0");
  return `${monthStr} ${dayStr}.`;
};

/**
 * Get berry income multiplier based on season (month).
 * Winter months have reduced yields for both foraging and berry planters.
 * Multiplier ranges from 0 (harsh winter) to 1.0 (optimal growing season).
 */
export const getBerryIncomeMultiplier = (day: number): number => {
  const season = getSeasonByDay(day);
  return season.yieldMultiplier.forage!;
};

/**
 * Get fiber drop chance when gathering wood based on season.
 * Summer (warm months) have higher drop rates, winter has lower rates.
 */
export const getFiberDropChance = (day: number): number => {
  const season = getSeasonByDay(day);
  return season.weights.fiberDrop;
};

/**
 * Get rabbit trap catch likelihood based on season.
 * Rabbits are most active searching for food in winter (desperate)
 * and spring (breeding, feeding young). Least active in summer when food is abundant.
 */
export const getRabbitCatchLikelihood = (day: number): number => {
  const season = getSeasonByDay(day);
  return season.weights.rabbitCatch;
};

/**
 * Get daily wood cost based on season (day).
 * Coldest months (Deepcold, Frostmoon, Snowveil) cost the most;
 * warmest months (Sunswept, Harvestrise, Goldleaf) cost nothing.
 */
export const getWoodCostPerDay = (day: number): number => {
  const season = getSeasonByDay(day);
  return season.weights.woodCost;
};

/**
 * Check if an action can be completed entirely within daylight hours.
 * @param currentTime - Current time (0-23 hours)
 * @param actionTimeCost - Duration of action in hours
 * @param day - Day number (0-359)
 * @returns true if both start and end time are within daylight, false otherwise
 */
export const isActionWithinDaylight = (
  currentTime: number,
  actionTimeCost: number,
  day: number,
): boolean => {
  const season = getSeasonByDay(day);
  const endTime = currentTime + actionTimeCost;

  return (
    inRange(currentTime, season.sunrise, season.sunset) &&
    inRange(endTime, season.sunrise, season.sunset + 1)
  );
};
