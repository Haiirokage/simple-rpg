const getNewMaxSatiation = (
  currentMaxSatiation: number,
  foodTypesConsumed: number,
): number => {
  const threshold = 40 + 20 * foodTypesConsumed;

  if (currentMaxSatiation > threshold) {
    return Math.max(currentMaxSatiation - 5, threshold);
  }
  return Math.min(currentMaxSatiation + 5 * foodTypesConsumed, threshold);
};

/**
 * Calculate daily satiation and maxSatiation updates based on food diversity.
 *
 * Mechanics:
 * - Satiation delta: -5 + 8 * foodTypesConsumed (hunger + food bonus)
 * - MaxSatiation: grows by 5 per food type (capped at threshold), or decays by 5 if over threshold
 * - Threshold: 40 + 20 * foodTypesConsumed
 */
export const updateSatiationFromFood = (
  currentSatiation: number,
  currentMaxSatiation: number,
  foodTypesConsumed: number,
): { satiation: number; maxSatiation: number } => {
  const newMaxSatiation = getNewMaxSatiation(
    currentMaxSatiation,
    foodTypesConsumed,
  );

  // Apply satiation delta: hunger (-5) + food bonus (8 per type)
  const satiationDelta = -5 + 8 * foodTypesConsumed;
  const newSatiation = Math.max(
    0,
    Math.min(currentSatiation + satiationDelta, newMaxSatiation),
  );

  return { satiation: newSatiation, maxSatiation: newMaxSatiation };
};
