import type { ResourceStore } from "../resources/types";

export type LocationId = "lake";

export type ExplorationStore = {
  active: boolean;
  inventory: Partial<ResourceStore>; // temporary storage while exploring
  actions: { cur: number; max: number }; // exploration actions this trip
  location?: LocationId; // current location if visiting one
};

export const defaultExplorationStore: ExplorationStore = {
  active: false,
  inventory: {},
  actions: { cur: 0, max: 0 },
};

/**
 * Calculate max exploration actions based on constitution.
 * Formula: 2 + floor(constitution / 20)
 * Range: 2 (con 0) to 7 (con 100)
 */
export const getMaxExplorationActions = (constitution: number): number => {
  return 2 + Math.floor(constitution / 20);
};
