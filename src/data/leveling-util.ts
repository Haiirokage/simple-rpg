export type LeveledStat = {
  level: number;
  exp: number;
};

export const getExpThreshold = (level: number): number => {
  return Math.floor(10 + 10 * Math.pow(1.45, level));
};
/**
 * Recursively levels up a stat based on experience accumulation.
 * Uses (10 + 10 * 1.45^level) formula for exp thresholds.
 * Max level is 100.
 */
export const levelUpRecursively = (level: number, exp: number): LeveledStat => {
  if (level >= 100) {
    return { level: 100, exp };
  }

  const expThreshold = getExpThreshold(level);
  if (exp >= expThreshold) {
    return levelUpRecursively(level + 1, exp - expThreshold);
  }

  return { level, exp };
};
