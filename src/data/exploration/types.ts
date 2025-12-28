import type { ResourceStore } from "../resources/types";

export type ExplorationStore = {
  active: boolean;
  endTime?: number; // hour when expedition must end
  inventory: Partial<ResourceStore>; // temporary storage while exploring
};

export const defaultExplorationStore: ExplorationStore = {
  active: false,
  inventory: {},
};
