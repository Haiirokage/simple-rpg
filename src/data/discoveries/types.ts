import type { DiscoveryType } from "../../biome/forest/discovery-definitions";

export type ExtraDiscoveries = "successful_hunt" | "failed_hunt";

export type AllUnlockableDiscoveries = DiscoveryType | ExtraDiscoveries;
export type DiscoveriesStore = {
  [key in AllUnlockableDiscoveries]: number; // count discovered
};

export const defaultDiscoveriesStore: DiscoveriesStore = {
  berry_patch: 0,
  willow_grove: 0,
  rabbit_trail: 0,
  strong_inspiration: 0,
  // Not from ForestDiscoveries
  successful_hunt: 0,
  failed_hunt: 0,
};
