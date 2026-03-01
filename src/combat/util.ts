import { clamp } from "lodash";
import type { CreatureInstance } from "../npc/creature-definitions";

export type HitTarget = "head" | "body" | "legs";

/** multiplier based on distance and range in meters */
export const getDistanceMultiplier = (distance: number, bowRange = 150) => {
  const confidentRange = bowRange / 5;
  const linearDistanceMult = clamp((bowRange - distance) / (bowRange - confidentRange), 0, 1);
  return Math.sqrt(linearDistanceMult);
};

/** Composure multiplier from combat acuity. 0.8x at level 0, ~1.27x at level 10, ~2.3x at level 100. */
export const getComposureMultiplier = (acuity: number) => 0.8 + Math.sqrt(acuity) * 0.15;

/**
 * Calculate hit chance for a ranged attack.
 * @param playerDex - Player's dexterity level
 * @param playerRanged - Player's ranged skill level
 * @param distance - Distance to target in meters
 * @param enemyDex - Enemy's dexterity level
 * @param bowRange - Maximum effective range of the bow in meters
 * @param discovered - Whether the target is aware of the attack
 * @returns hit chance as a probability between 0 and 1
 */
export const calculateHitChance = (
  playerDex: number,
  playerRanged: number,
  distance: number,
  enemyDex: number,
  bowRange: number,
  discovered?: boolean,
  acuity = 0,
): number => {
  const distanceMultiplier = getDistanceMultiplier(distance, bowRange);
  const dexMult = 0.8 + playerDex / 100;
  const rangedMult = 0.2 + playerRanged / 25;
  const composureMult = getComposureMultiplier(acuity);
  const enemyDexMult = discovered ? clamp((playerDex - enemyDex + 30) / 40, 0, 1) : 1;

  const hitChance = clamp(
    distanceMultiplier * dexMult * rangedMult * composureMult * enemyDexMult,
    0,
    1,
  );
  return hitChance;
};

export const HIT_SEVERITY = ["critical", "severe", "miss"] as const;
export type HitSeverity = (typeof HIT_SEVERITY)[number];

/** Higher multiplier = narrower critical/severe bands = harder to land a clean hit. */
const SEVERITY_MULTIPLIER: Record<HitTarget, number> = { head: 15, body: 5, legs: 10 };

/**
 * Rolls to determine hit severity based on hit chance and target.
 * @param target - The body part being targeted
 * @param hitChance - The probability of hitting (0-1)
 * @returns The severity of the hit: critical, severe, or miss
 */
export const calculateHitSeverity = (
  target: HitTarget,
  hitChance: number,
): "critical" | "severe" | "miss" => {
  const roll = Math.random();
  const hitMargin = Math.max(0, roll - hitChance + 0.4);
  const multiplier = SEVERITY_MULTIPLIER[target];
  console.log("roll", roll, hitMargin, multiplier);
  return HIT_SEVERITY[Math.min(Math.floor(hitMargin * multiplier), 2)];
};

/**
 * Effective probability of not missing for a given target.
 * Head and legs have tighter hit windows, reducing effective hit chance.
 */
export const getEffectiveHitChance = (hitChance: number, target: HitTarget): number =>
  clamp(hitChance - (0.4 - 2 / SEVERITY_MULTIPLIER[target]), 0, 1);

/**
 * Calculate exp multiplier based on shot difficulty.
 * Easy shots (high hit chance) teach you less than challenging shots.
 * Full exp at 5% hit chance, decreasing linearly to 10% exp at 95%+ hit chance.
 * @param hitChance - The probability of hitting (0-1)
 * @returns multiplier for experience gain (0.1-1.0)
 */
export const getDifficultyMultiplier = (hitChance: number): number => {
  // 5% = 1.0x, 25% = 0.8x, 50% = 0.55x, 75% = 0.3x, 95% = 0.1x
  return Math.max(0.1, 1.0 - Math.max(0, hitChance - 0.05));
};

export type WoundStatus = "healthy" | "wounded" | "critical";

export const getWoundStatus = (npc: { health: number; maxHealth: number }): WoundStatus => {
  const ratio = npc.health / npc.maxHealth;
  if (ratio > 0.7) return "healthy";
  if (ratio > 0.3) return "wounded";
  return "critical";
};

const DEX_PENALTY: Record<WoundStatus, number> = {
  healthy: 1,
  wounded: 0.9,
  critical: 0.5,
};

/** Effective dex after wound penalties. */
export const getEffectiveDex = (creature: CreatureInstance) => {
  return creature.attributes.dexterity * DEX_PENALTY[getWoundStatus(creature)];
};

/** Sprint distance in meters for a creature over a time interval.
 * Speed = cbrt(effectiveDex) * speedFactor. */
export const getSprintDistance = (creature: CreatureInstance, seconds: number) => {
  const speed = Math.cbrt(getEffectiveDex(creature)) * creature.speedFactor;
  return Math.round(speed * seconds);
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
  const penetration = Math.max(0, force - defence);
  const baseDamage = Math.min(5, penetration);
  const excessDamage = Math.max(0, Math.sqrt(penetration - 4) - 1 || 0);
  const damage = baseDamage + excessDamage;
  const healthLost = damage * damageMultiplier;
  return healthLost;
};
