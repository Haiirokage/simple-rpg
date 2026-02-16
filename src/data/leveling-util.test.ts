import { describe, it } from "vitest";
import { getExpThreshold, getExpRewardByDC } from "./leveling-util";

const sci = (n: number) => (n > 9999 ? n.toExponential(2) : n);

/** XP reward for succeeding a skill check at given DC */
export const getTestExpRewardByDC = (dc: number): number => {
  return Math.round(Math.pow(1.44, (dc - 3) * 7 - 31) + (dc - 3) * 10);
};

describe("exp curves", () => {
  it("exp thresholds by level", () => {
    const levels = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
    console.table(
      levels.map((level) => ({
        level,
        threshold: sci(getExpThreshold(level)),
      })),
    );
  });

  it("exp rewards by DC", () => {
    const dcs = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
    console.table(
      dcs.map((dc) => ({
        dc,
        reward: sci(getExpRewardByDC(dc)),
        testReward: sci(getTestExpRewardByDC(dc)),
      })),
    );
  });

  it("checks needed to level - current system (max bonus 5+5)", () => {
    const levels = [0, 9, 16, 25, 35, 50, 60, 75, 80, 90, 99];
    const getSkillBonus = (level: number) => Math.floor(Math.sqrt(level) / 2);
    const getAttrBonus = (level: number) => Math.floor(level / 20);

    console.table(
      levels.map((level) => {
        const skillBonus = getSkillBonus(level);
        const sameAttrBonus = getAttrBonus(level);
        const maxAttrBonus = 5;
        const dcSameAttr = 6 + skillBonus + sameAttrBonus;
        const dcMaxAttr = 6 + skillBonus + maxAttrBonus;
        const threshold = getExpThreshold(level);

        return {
          level,
          threshold: sci(threshold),
          dcSame: dcSameAttr,
          checksSame: sci(Math.ceil(threshold / getExpRewardByDC(dcSameAttr))),
          dcMax: dcMaxAttr,
          checksMax: sci(Math.ceil(threshold / getExpRewardByDC(dcMaxAttr))),
        };
      }),
    );
  });

  it("checks needed to level - proposed system (skill max 10, attr max 5)", () => {
    const levels = [0, 9, 16, 25, 35, 50, 60, 75, 80, 90, 99];
    const getSkillBonus = (level: number) => Math.floor(Math.sqrt(level));
    const getAttrBonus = (level: number) => Math.floor(level / 20);

    console.table(
      levels.map((level) => {
        const skillBonus = getSkillBonus(level);
        const sameAttrBonus = getAttrBonus(level);
        const maxAttrBonus = 5;
        const dcSameAttr = 6 + skillBonus + sameAttrBonus;
        const dcMaxAttr = 6 + skillBonus + maxAttrBonus;
        const threshold = getExpThreshold(level);
        const sameAttrExp = getTestExpRewardByDC(dcSameAttr);

        return {
          level,
          threshold: sci(threshold),
          sameAttrExp: sci(sameAttrExp),
          dcSame: dcSameAttr,
          checksSame: sci(Math.ceil(threshold / sameAttrExp)),
          dcMax: dcMaxAttr,
          checksMax: sci(Math.ceil(threshold / getTestExpRewardByDC(dcMaxAttr))),
        };
      }),
    );
  });
});
