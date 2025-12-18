import type { HomeUpgradeKeys } from "./types";
import type { ResourceStore } from "../resources/types";

export type HomeUpgradeDefinition = {
  key: HomeUpgradeKeys;
  name: string;
  timeCost: number;
  resourceCost: Partial<ResourceStore>;
};

export const HOME_UPGRADES: HomeUpgradeDefinition[] = [
  {
    key: "smoker",
    name: "Smoker",
    timeCost: 6,
    resourceCost: { stone: 25 },
  },
];
