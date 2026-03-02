import type { CraftComponentMaterial, CraftComponentType } from "./types";

export const MATERIAL_WEIGHTS: Record<CraftComponentMaterial, number> = {
  copper: 0.2,
};

export const CASTING_XP_MULTIPLIERS: Record<CraftComponentMaterial, number> = {
  copper: 3,
};

const _ = false;
const X = true;

export type CastingDefinition = {
  type: CraftComponentType;
  label: string;
  barCost: number;
  /** Compact bounding-box shape — no padding required */
  mold: boolean[][];
};

// prettier-ignore
const KNIFE_BLADE_MOLD: boolean[][] = [
  [_, X],
  [X, X],
  [X, X],
  [_, X],
  [_, X],
];

// prettier-ignore
const AXE_HEAD_MOLD: boolean[][] = [
  [_, X, _, _, _],
  [X, X, X, _, _],
  [X, X, X, X, X],
  [X, X, X, _, _],
  [_, X, _, _, _],
];

// prettier-ignore
const PICK_HEAD_MOLD: boolean[][] = [
  [_, _, _, X, X, X],
  [_, _, X, X, X, X],
  [_, X, X, X, _, _],
  [X, X, _, _, _, _],
  [X, _, _, _, _, _],
];

// prettier-ignore
const SWORD_BLADE_MOLD: boolean[][] = [
  [_, _, _, _, _, X],
  [_, _, _, _, X, X],
  [_, _, _, X, X, X],
  [_, _, X, X, X, _],
  [_, X, X, X, _, _],
  [X, X, X, _, _, _],
  [X, _, _, _, _, _],
];

// prettier-ignore
const BAR_MOLD: boolean[][] = [
  [X, X],
  [X, X],
  [X, X],
];

export const CASTING_DEFINITIONS: Record<CraftComponentType, CastingDefinition> = {
  bar: { type: "bar", label: "Bar", barCost: 1, mold: BAR_MOLD },
  knifeBlade: { type: "knifeBlade", label: "Knife blade", barCost: 1, mold: KNIFE_BLADE_MOLD },
  axeHead: { type: "axeHead", label: "Axe head", barCost: 3, mold: AXE_HEAD_MOLD },
  pickHead: { type: "pickHead", label: "Pick head", barCost: 3, mold: PICK_HEAD_MOLD },
  swordBlade: { type: "swordBlade", label: "Sword blade", barCost: 5, mold: SWORD_BLADE_MOLD },
};

/** Returns the CastingDefinition whose mold matches the filled bounding box of the grid, or null. */
export const matchMold = (grid: boolean[][]): CastingDefinition | null => {
  const filled = grid.flatMap((row, r) => row.flatMap((cell, c) => (cell ? [{ r, c }] : [])));
  if (filled.length === 0) return null;

  const minR = Math.min(...filled.map((p) => p.r));
  const maxR = Math.max(...filled.map((p) => p.r));
  const minC = Math.min(...filled.map((p) => p.c));
  const maxC = Math.max(...filled.map((p) => p.c));

  return (
    Object.values(CASTING_DEFINITIONS).find(({ mold }) => {
      if (maxR - minR + 1 !== mold.length || maxC - minC + 1 !== mold[0].length) return false;
      return mold.every((row, r) => row.every((cell, c) => grid[minR + r][minC + c] === cell));
    }) ?? null
  );
};
