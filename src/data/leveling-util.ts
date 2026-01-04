export type LeveledStat = {
  level: number;
  exp: number;
};

/**
 * Recursively levels up a stat based on experience accumulation.
 * Uses 1.4^level formula for exp thresholds.
 * Max level is 100.
 */
export const levelUpRecursively = (level: number, exp: number): LeveledStat => {
  if (level >= 100) {
    return { level: 100, exp };
  }

  const expThreshold = Math.pow(1.4, level);
  if (exp >= expThreshold) {
    return levelUpRecursively(level + 1, exp - expThreshold);
  }

  return { level, exp };
};
