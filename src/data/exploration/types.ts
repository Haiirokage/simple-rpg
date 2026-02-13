import type { BiomeType } from "../../biome/discovery-types";
import type { ResourceStore } from "../resources/types";

export type LocationId = "lake" | "tavern";

export type Lodging = {
  location: string;
  nutritionLevel: number;
};

export type ExplorationStore = {
  active: boolean;
  biome: BiomeType;
  inventory: Partial<ResourceStore>; // temporary storage while exploring
  actions: { cur: number; max: number }; // exploration actions this trip
  location?: LocationId; // current location if visiting one
  lodging: Partial<Record<BiomeType, Lodging>>;
};

export const defaultExplorationStore: ExplorationStore = {
  active: false,
  biome: "forest",
  inventory: {},
  actions: { cur: 0, max: 0 },
  lodging: {},
};

/**
 * Calculate max exploration actions based on constitution.
 * Formula: 2 + floor(constitution / 20)
 * Range: 2 (con 0) to 7 (con 100)
 */
export const getMaxExplorationActions = (constitution: number): number => {
  return 2 + Math.floor(constitution / 20);
};
