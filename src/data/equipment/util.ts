import type { NumberRange } from "./definitions";

export const getValueByLevel = (level = 1, range: NumberRange = { min: 1 }) => {
  if (range.max) {
    const diff = range.max - range.min;
    const incrPerLevel = diff / 100;
    const rawValue = range.min + incrPerLevel * level;
    const factor = Math.pow(10, range.decimals || 0);
    const roundedValue = Math.round(rawValue * factor) / factor;
    return roundedValue;
  }
  return range.min;
};

export const biasedRandom = (bias: number, min = 1, max = 100, influence = 1) => {
  const rnd = Math.random() * (max - min) + min;
  const mix = Math.random() * influence;
  return rnd * (1 - mix) + bias * mix;
};

const gauss = (x: number, influence = 1) => {
  return Math.exp((-(x - 50) * (x - 50)) / (2 * influence * influence));
};

export const biasedGaussRandom = (bias: number, influence = 50, min = 1, max = 100) => {
  const rnd = Math.floor(Math.random() * (max - min + 1)) + min;
  const inf = Math.floor(Math.random() * 101);

  return rnd < bias
    ? rnd + Math.floor(gauss(inf, influence) * (bias - rnd))
    : rnd - Math.floor(gauss(inf, influence) * rnd - bias);
};

export const getEquipmentLevel = (craftingLevel: number, tier: number) => {
  const influence = 50 * tier;
  return biasedGaussRandom(craftingLevel, influence);
};
