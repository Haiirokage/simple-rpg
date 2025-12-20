/**
 * Calculate the number of levels gained from a successful action.
 *
 * For positive diff (action harder than current level):
 *   levels = 1 + log2(diff)
 *
 * For negative diff (action easier than current level):
 *   chance of level = 10^(diff/20)
 *
 */
export const calculateLevelGain = (
  actionComplexity: number,
  playerTier: number,
  playerLevel: number,
): number => {
  const playerKnowledge = playerTier * 100 + playerLevel;
  const diff = actionComplexity - playerKnowledge;

  if (diff > 0) {
    return Math.ceil(1 + Math.log(diff));
  }

  const likelihood = Math.pow(10, diff / 20);

  return Math.random() < likelihood ? 1 : 0;
};
