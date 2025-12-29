export type DiscoveryType = "berry_patch";

export interface DiscoveryDefinition {
  type: DiscoveryType;
  maxCount: number;
  discoveryRange: { min: number; max: number };
  rarity: number;
}

export const FOREST_DISCOVERIES: Record<DiscoveryType, DiscoveryDefinition> = {
  berry_patch: {
    type: "berry_patch",
    maxCount: 5,
    discoveryRange: { min: 50, max: 275 },
    rarity: 0.3,
  },
};
