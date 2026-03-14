import type { ResourceStore } from "../resources/types";
import type { StructureKey } from "./hooks";
import type { SmithingKnowledgeMap } from "../smithing/types";
import type { ComponentCost } from "../craftComponents/types";

export type StructureUnlockContext = {
  smithing: SmithingKnowledgeMap;
};

export type StructureDefinition = {
  key: StructureKey;
  name: string;
  tooltip?: string;
  timeCost: number;
  resourceCost: Partial<ResourceStore>;
  componentCost?: ComponentCost;
  plotCost: number;
  unlocked?: (ctx: StructureUnlockContext) => boolean;
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
  resourceCost: { wood: 5, stone: 8 },
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

export const WORKSHOP: StructureDefinition = {
  key: "workshop",
  name: "Workshop",
  tooltip:
    "Provides a convenient place to craft new tools. Also has lots of storage space for your crafting components",
  timeCost: 8,
  resourceCost: { wood: 30, stone: 10 },
  componentCost: { bar: { copper: 2 } },
  plotCost: 3,
  unlocked: ({ smithing }) => smithing.smelting.basics,
};

export const STRUCTURES = [BERRY_PLANTER, PANTRY, WOOD_SHED, STONE_PILE, WORKSHOP];
