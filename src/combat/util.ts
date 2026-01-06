import { clamp } from "lodash";

const BOW_RANGE = 150; // in meters

/**
 * Calculate hit chance for a ranged attack.
 * @param playerDex - Player's dexterity level
 * @param playerRanged - Player's ranged skill level
 * @param distance - Distance to target in meters
 * @param enemyDex - Enemy's dexterity level
 * @param discovered - Whether the target is aware of the attack
 * @returns how far you got from the exact target.
 */
export const calculateHit = (
  playerDex: number,
  playerRanged: number,
  distance: number,
  enemyDex: number,
  discovered?: boolean,
): number => {
  const confidentRange = BOW_RANGE / 5;
  const linearDistance = clamp((BOW_RANGE - distance) / (BOW_RANGE - confidentRange), 0, 1);
  const distanceMultiplier = Math.pow(linearDistance, 1 / 10);

  const dexMult = 0.2 + playerDex / 50;
  const rangedMult = 0.2 + playerRanged / 50;

  const roll = Math.random();

  if (discovered) {
    const enemyDexMult = clamp((playerDex - enemyDex + 30) / 40, 0, 1);
    const hitChance = clamp(distanceMultiplier * dexMult * rangedMult * enemyDexMult, 0, 1);
    return Math.max(0, roll - hitChance);
  }

  const hitChance = clamp(distanceMultiplier * dexMult * rangedMult, 0, 1);
  return Math.max(0, roll - hitChance);
};

export const HIT_SEVERITY = ["critical", "severe", "miss"] as const;
export const getHitSeverityByTarget = (
  target: "head" | "body" | "legs",
  hitMargin: number,
): "critical" | "severe" | "miss" => {
  const getHitType = (multiplier: number) =>
    HIT_SEVERITY[Math.min(Math.floor(hitMargin * multiplier), 2)];
  switch (target) {
    case "head":
      return getHitType(15);
    case "body":
      return getHitType(5);
    case "legs":
    default:
      return getHitType(10);
  }
};

const force = 30; // something random for now
/**
 *
 * @param defence How much force is abvsorbed by armor
 * @param damageMultiplier Multiplier based on target location and hit type (i.e. critical hit)
 * @returns
 */
export const getHealthLost = (defence: number, damageMultiplier: number): number => {
  /** damage is an abstract number representing impact severity.
   * The same damage on the head or the leg would have different results
   * A damage of 5 should be critical. It means full penetration. A higher damage than that should however have an impact on targets that normally wouldn't be fatal.
   * We can add a damage multiplier per target. i.e. head * 25, body * 15, legs * 5.
   */
  const baseDamage = Math.min(5, force - defence);
  const excessDamage = Math.sqrt(Math.max(0, force - defence - 4)) - 1;
  const damage = baseDamage + excessDamage;
  const healthLost = damage * damageMultiplier;
  return healthLost;
};
