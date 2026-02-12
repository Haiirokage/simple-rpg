import type { AllUnlockables } from "../../biome/discovery-types";

export type DiscoveriesStore = Record<AllUnlockables, number>;

export const defaultDiscoveriesStore: DiscoveriesStore = {
  // Forest unlockables
  berry_patch: 0,
  willow_grove: 0,
  rabbit_trail: 0,
  strong_inspiration: 0,
  large_lake: 0,
  // Village unlockables
  village_tavern: 0,
  // Extras
  successful_hunt: 0,
  failed_hunt: 0,
  find_tubers: 0,
  village_rumor: 0,
};
