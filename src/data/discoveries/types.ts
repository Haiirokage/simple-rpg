import type { DiscoveryType } from "../../biome/forest/discovery-definitions";

export type DiscoveriesStore = {
  [key in DiscoveryType]: number; // count discovered
};

export const defaultDiscoveriesStore: DiscoveriesStore = {
  berry_patch: 0,
  willow_grove: 0,
};
