import { describe, it } from "vitest";
import {
  calculateHitChance,
  calculateHitSeverity,
  getEffectiveHitChance,
  getHealthLost,
  type HitTarget,
} from "./util";

const TRIALS = 200;
const HIT_CHANCES = [0.1, 0.2, 0.4, 0.6, 0.8, 1, 1.2];
const TARGETS: HitTarget[] = ["head", "body", "legs"];

const RANGED_LEVELS = [0, 5, 10, 20, 50];
const SHOT_TYPES: { label: string; distance: number; target: HitTarget; armorRating: number }[] = [
  { label: "body@100m", distance: 100, target: "body", armorRating: 15 },
  { label: "body@150m", distance: 150, target: "body", armorRating: 15 },
  { label: "head@100m", distance: 100, target: "head", armorRating: 15 },
  { label: "head@150m", distance: 150, target: "head", armorRating: 15 },
];
const TARGET_DAMAGE: Record<HitTarget, number> = { head: 25, body: 15, legs: 5 };

describe("ranged exp", () => {
  it("distance factor", () => {
    const rows = [50, 100, 150, 200].flatMap((distance) => {
      const distanceFactor = Math.max(0.1, ((distance - 30) / 60) ** 3);
      const oldFactor = Math.max(0.1, (distance - 20) / 100);
      return { distance, distanceFactor, oldFactor };
    });
    console.table(rows);
  });
  it("discovery factor", () => {
    const rows = [20, 40, 60, 80].flatMap((enemyDex) => {
      const oldDiscFactor = 1 + enemyDex / 10;
      return { enemyDex, oldDiscFactor, discFactor: oldDiscFactor ** 2 };
    });
    console.table(rows);
  });
  it("expected exp/shot by ranged level and shot type", () => {
    const bowRange = 170;

    const rows = RANGED_LEVELS.flatMap((rangedLevel) =>
      SHOT_TYPES.map(({ label, distance, target, armorRating }) => {
        const hitChance = calculateHitChance(rangedLevel, rangedLevel, distance, 20, bowRange);
        const effectiveHC = getEffectiveHitChance(hitChance, target);
        const distanceFactor = Math.max(0.1, ((distance - 20) / 60) ** 3);
        const difficultyMultiplier = Math.max(0.1, 1.0 - Math.max(0, effectiveHC - 0.05));

        let totalExp = 0;
        for (let i = 0; i < TRIALS; i++) {
          const severity = calculateHitSeverity(target, hitChance);
          if (severity === "miss") continue;
          const healthLost = getHealthLost(
            armorRating,
            TARGET_DAMAGE[target] * (severity === "critical" ? 1 : 0.5),
          );
          const severityBonus = severity === "critical" ? 2 : 1;
          totalExp +=
            Math.max(healthLost, 1) * distanceFactor * difficultyMultiplier * severityBonus;
        }

        return {
          rangedLevel,
          shot: label,
          hitChance: `${Math.round(effectiveHC * 100)}%`,
          expPerShot: Math.round((totalExp / TRIALS) * 10) / 10,
        };
      }),
    );
    console.table(rows);
  });
});

describe("calculateHitSeverity", () => {
  it("outcome distribution by target and hit chance", () => {
    const rows = TARGETS.flatMap((target) =>
      HIT_CHANCES.map((hitChance) => {
        const counts = { critical: 0, severe: 0, miss: 0 };
        for (let i = 0; i < TRIALS; i++) {
          counts[calculateHitSeverity(target, hitChance)]++;
        }
        const pct = (n: number) => `${Math.round((n / TRIALS) * 100)}%`;
        return {
          target,
          hitChance: `${Math.round(hitChance * 100)}%`,
          critical: pct(counts.critical),
          severe: pct(counts.severe),
          miss: pct(counts.miss),
        };
      }),
    );
    console.table(rows);
  });
});
