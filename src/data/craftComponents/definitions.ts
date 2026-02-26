import type { CraftComponentMaterial, CraftComponentType } from "./types";

export const MATERIAL_WEIGHTS: Record<CraftComponentMaterial, number> = {
  copper: 0.2,
};

export type CastingDefinition = {
  type: CraftComponentType;
  label: string;
  barCost: number;
};

export const CASTING_DEFINITIONS: CastingDefinition[] = [
  { type: "knifeBlade", label: "Knife blade", barCost: 1 },
];
