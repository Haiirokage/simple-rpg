import type { ResourceStore } from "../resources/types";
import type { StructureKey } from "./hooks";

export type StructureDefinition = {
  key: StructureKey;
  name: string;
  timeCost: number;
  resourceCost: Partial<ResourceStore>;
  plotCost: number;
};

export const BERRY_PLANTER: StructureDefinition = {
  key: "berryPlanter",
  name: "Berry Planter",
  timeCost: 2,
  resourceCost: { wood: 10, berry: 2 },
  plotCost: 1,
} as const;

export const PANTRY: StructureDefinition = {
  key: "pantry",
  name: "Pantry",
  timeCost: 12,
  resourceCost: { wood: 60, stone: 20 },
  plotCost: 4,
} as const;

export const WOOD_SHED: StructureDefinition = {
  key: "woodShed",
  name: "Wood Shed",
  timeCost: 5,
  resourceCost: { wood: 15, stone: 5 },
  plotCost: 1,
} as const;

export const STONE_PILE: StructureDefinition = {
  key: "stonePile",
  name: "Stone Pile",
  timeCost: 5,
  resourceCost: { wood: 5, stone: 5 },
  plotCost: 1,
} as const;

export const STRUCTURES = [BERRY_PLANTER, PANTRY, WOOD_SHED, STONE_PILE];
