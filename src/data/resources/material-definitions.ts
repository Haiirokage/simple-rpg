import type { ResourceKeys } from "./types";

export type MaterialResourceDefinition = {
  key: ResourceKeys;
  baseCapacity: number; // capacity without storage buildings
  capacityPerShed?: number; // bonus capacity per building
  capacityPerStonePile?: number; // bonus capacity per stone pile
  decayRate?: number; // daily decay as percentage (0 = no decay, 0.01 = 1% per day)
};

export const MATERIAL_STORAGE: MaterialResourceDefinition[] = [
  {
    key: "wood",
    baseCapacity: 20,
    capacityPerShed: 180, // wood shed adds 80
    decayRate: 0.02, // 1% decay per day
  },
  {
    key: "stone",
    baseCapacity: 10,
    capacityPerStonePile: 50,
  },
  {
    key: "fiber",
    baseCapacity: 20,
    decayRate: 0.01, // 1% decay per day
  },
];
