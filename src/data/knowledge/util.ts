import type { Knowledge } from "./types";

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
  actionComplexity: number = 0,
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

/**
 * Calculate energy cost modifier based on player knowledge vs action complexity.
 *
 * - +1 energy reduction if player is 25+ levels above the action
 * - -1 energy penalty if player is 25+ levels below the action
 * - -1 energy penalty if player tier is lower than action tier
 */
export const calculateEnergyModifier = (
  actionComplexity: number = 0,
  playerLevel: Knowledge,
): number => {
  const playerKnowledge = playerLevel.tier * 100 + playerLevel.level;
  const levelDiff = playerKnowledge - actionComplexity;
  const actionTier = Math.floor(actionComplexity / 100);

  const levelModifier = levelDiff >= 25 ? -1 : levelDiff <= -25 ? 1 : 0;
  const tierModifier = playerLevel.tier < actionTier ? 1 : 0;

  return levelModifier + tierModifier;
};

/**
 * Calculate yield multiplier based on player knowledge vs action complexity.
 *
 * Uses tanh curve: multiplier = 1 + 0.9 * tanh(diff / 17)
 * - Approaches 0.1 as diff → -∞
 * - Equals 1.0 at diff = 0 (target complexity)
 * - Approaches 1.9 as diff → +∞
 */
export const calculateYieldMultiplier = (
  actionComplexity = 0,
  playerLevel: Knowledge,
): number => {
  const playerKnowledge = playerLevel.tier * 100 + playerLevel.level;
  const diff = playerKnowledge - actionComplexity;

  return 1 + 0.9 * Math.tanh(diff / 17);
};
