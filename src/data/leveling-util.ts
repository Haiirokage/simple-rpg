export type LeveledStat = {
  level: number;
  exp: number;
};

export const getExpThreshold = (level: number): number => {
  return Math.floor(10 + 10 * Math.pow(1.45, level));
};

/** XP reward for succeeding a skill check at given DC */
export const getExpRewardByDC = (dc: number): number => {
  //return Math.round(Math.pow(1.45, (dc - 1) * 7 - 20) + dc * 25); //old dc reward based on 5 + 5 bonus from skill
  return Math.round(Math.pow(1.44, (dc - 3) * 7 - 31) + (dc - 3) * 10); //new dc reward based on 5 + 10 bonus from skill
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
