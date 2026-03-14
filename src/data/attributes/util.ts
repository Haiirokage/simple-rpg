/**
 * Calculate two-arm force capacity in pounds based on strength level.
 *
 * Formula: Force = (20 + strength) * sexMultiplier + 0.005 * strength²
 *
 * @param strengthLevel - Strength attribute level
 * @param female - default false. men have higher base strength
 * @returns Force in pounds
 */
export const calculateForce = (strengthLevel: number, female = false): number => {
  const sexMultiplier = female ? 1 : 2;

  return (20 + strengthLevel) * sexMultiplier + 0.01 * strengthLevel * strengthLevel;
};
