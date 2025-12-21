import type { ResourceKeys } from "./types";

export type MaterialResourceDefinition = {
  key: ResourceKeys;
  baseCapacity: number; // capacity without storage buildings
  capacityPerBuilding: number; // bonus capacity per building
  decayRate?: number; // daily decay as percentage (0 = no decay, 0.01 = 1% per day)
};

export const MATERIAL_STORAGE: MaterialResourceDefinition[] = [
  {
    key: "wood",
    baseCapacity: 20,
    capacityPerBuilding: 30, // wood shed adds 30
    decayRate: 0.01, // 1% decay per day
  },
  {
    key: "stone",
    baseCapacity: 10,
    capacityPerBuilding: 0, // no storage building yet
  },
  {
    key: "fiber",
    baseCapacity: 20,
    capacityPerBuilding: 0, // no storage building yet
    decayRate: 0.01, // 1% decay per day
  },
];

export const getMaterialStorageCapacity = (
  resourceKey: ResourceKeys,
  buildingCounts: Record<string, number>,
): number => {
  const def = MATERIAL_STORAGE.find((d) => d.key === resourceKey);
  if (!def) return Infinity;
  if (resourceKey === "wood") {
    return def.baseCapacity + def.capacityPerBuilding * (buildingCounts.woodShed || 0);
  }

  return def.baseCapacity;
};
