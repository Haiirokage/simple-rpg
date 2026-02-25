import { describe, it } from "vitest";
import { getValueByLevel, biasedGaussRandom } from "./util";
import { TOOL_DEFINITIONS } from "./definitions";

const SAMPLES = 300;

const sampleBiasedGauss = (bias: number, influence: number) => {
  const results = Array.from({ length: SAMPLES }, () => biasedGaussRandom(bias, influence));
  const min = Math.min(...results);
  const max = Math.max(...results);
  const avg = Math.round(results.reduce((a, b) => a + b, 0) / SAMPLES);
  return { min, avg, max };
};

describe("equipment crafting", () => {
  it("max output of biasedGaussRandom for different bias and influence values", () => {
    const biasValues = [40, 50, 60, 70];
    const influences = [10, 20, 30, 40, 50, 60, 70];

    console.table(
      biasValues.flatMap((bias) =>
        influences.map((influence) => {
          const { min, avg, max } = sampleBiasedGauss(bias, influence);
          return { bias, influence, min, avg, max };
        }),
      ),
    );
  });

  it("item level outcomes with influence = 30 + tier * 5, by crafting level and tier", () => {
    const craftingLevels = [10, 20, 40, 60, 80];
    const tiers = [1, 2, 3];

    console.table(
      craftingLevels.flatMap((craftingLevel) =>
        tiers.map((tier) => {
          const influence = 30 + tier * 5;
          const { min, avg, max } = sampleBiasedGauss(craftingLevel, influence);
          return { craftingLevel, tier, influence, min, avg, max };
        }),
      ),
    );
  });

  it("tierBaseBias + influence by tier: bias = craftingLevel * 2 - (tier-1) * 30, influence = 70 - tier * 10", () => {
    const craftingLevels = [1, 10, 20, 25, 30, 35, 40];
    const tiers = [1, 2, 3];

    console.table(
      craftingLevels.flatMap((craftingLevel) =>
        tiers.map((tier) => {
          const bias = craftingLevel * 3 - (tier - 1) * 30;
          const influence = 70 - tier * 8;
          const results = Array.from({ length: SAMPLES }, () => biasedGaussRandom(bias, influence));
          const min = Math.min(...results);
          const avg = Math.round(results.reduce((a, b) => a + b, 0) / SAMPLES);
          const max = Math.max(...results);
          return { craftingLevel, tier, bias, influence, min, avg, max };
        }),
      ),
    );
  });

  it("knife tier 1 (stone) vs tier 2 (copper): expected skinning bonus by crafting level", () => {
    const craftingLevels = [1, 10, 20, 30, 40, 50, 100];
    const [, stone, copper] = TOOL_DEFINITIONS.knife.tiers;
    const stoneRange = stone.bonus.skinning;
    const copperRange = copper.bonus.skinning;

    const sampleEquipmentLevel = (craftingLevel: number, tier: number) => {
      const influence = 30 + tier * 5;
      const results = Array.from({ length: SAMPLES }, () =>
        biasedGaussRandom(craftingLevel, influence),
      );
      const min = Math.min(...results);
      const max = Math.max(...results);
      const avg = Math.round(results.reduce((a, b) => a + b, 0) / SAMPLES);
      return { min, avg, max };
    };

    console.table(
      craftingLevels.map((craftingLevel) => {
        const t1 = sampleEquipmentLevel(craftingLevel, 1);
        const t2 = sampleEquipmentLevel(craftingLevel, 2);
        return {
          craftingLevel,
          "stone avg bonus": getValueByLevel(t1.avg, stoneRange),
          "copper avg bonus": getValueByLevel(t2.avg, copperRange),
          "stone max bonus": getValueByLevel(t1.max, stoneRange),
          "copper max bonus": getValueByLevel(t2.max, copperRange),
        };
      }),
    );
  });
});
