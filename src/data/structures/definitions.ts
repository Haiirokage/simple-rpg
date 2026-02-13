import type { ResourceStore } from "../resources/types";
import type { StructureKey } from "./hooks";

export type StructureDefinition = {
  key: StructureKey;
  name: string;
  tooltip?: string;
  timeCost: number;
  resourceCost: Partial<ResourceStore>;
  plotCost: number;
};

export const BERRY_PLANTER: StructureDefinition = {
  key: "berryPlanter",
  name: "Berry Planter",
  tooltip: "Generates berries every day.",
  timeCost: 2,
  resourceCost: { wood: 10, berry: 2 },
  plotCost: 1,
} as const;

export const PANTRY: StructureDefinition = {
  key: "pantry",
  name: "Pantry",
  tooltip: "Increases storage of food and reduces decay.",
  timeCost: 12,
  resourceCost: { wood: 60, stone: 20 },
  plotCost: 4,
} as const;

export const WOOD_SHED: StructureDefinition = {
  key: "woodShed",
  name: "Wood Shed",
  tooltip: "Increases wood storage.",
  timeCost: 5,
  resourceCost: { wood: 15, stone: 5 },
  plotCost: 1,
} as const;

export const STONE_PILE: StructureDefinition = {
  key: "stonePile",
  name: "Stone Pile",
  tooltip: "Increases stone storage.",
  timeCost: 5,
  resourceCost: { wood: 5, stone: 5 },
  plotCost: 1,
} as const;

export const STRUCTURES = [BERRY_PLANTER, PANTRY, WOOD_SHED, STONE_PILE];
