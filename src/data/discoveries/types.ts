import type { DiscoveryType } from "../../biome/forest/definitions";

export type DiscoveriesStore = {
  [key in DiscoveryType]: number; // count discovered
};

export const defaultDiscoveriesStore: DiscoveriesStore = {
  berry_patch: 0,
};
