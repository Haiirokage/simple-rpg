import type { ResourceStore } from "../../data/resources/types";

export type ActionCost = Partial<{
  time: number;
  minutes: number;
  energy: number;
  resources: Partial<ResourceStore>;
}>;
