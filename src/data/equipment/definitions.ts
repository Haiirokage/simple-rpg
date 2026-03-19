import type { ResourceStore } from "../resources/types";
import type { Skills } from "../skills/types";
import type { ConsumableType, ToolType } from "./types";
import type { ComponentCost } from "../craftComponents/types";

export type EquipmentDefinition = {
  key: ConsumableType;
  name: string;
  cost: Partial<ResourceStore>;
  maxCount: number;
};

export interface NumberRange {
  min: number;
  max?: number;
  decimals?: number;
}

export type EquipmentBonusType = "woodGathering" | "range" | "explorationChance" | "skinning";

export interface ToolTier {
  name: string; // e.g. "wooden", "stone", "iron"
  cost: Partial<ResourceStore>;
  componentCost: ComponentCost;
  bonus: Partial<Record<EquipmentBonusType, NumberRange>>;
  skillBonus?: Partial<Record<Skills, NumberRange>>;
}

export interface ToolDefinition {
  key: ToolType;
  name: string;
  tiers: ToolTier[]; // index 0+ are tier names (level 1+), level 0 is always "none"
}

const NO_TOOL = { name: "none", cost: {}, componentCost: {}, bonus: {} };

export const TOOL_DEFINITIONS = {
  hatchet: {
    key: "hatchet",
    name: "Hatchet",
    tiers: [
      NO_TOOL,
      {
        name: "stone",
        cost: { wood: 2, stone: 8 },
        componentCost: {},
        bonus: { woodGathering: { min: 3, max: 4.5, decimals: 1 } },
      },
      {
        name: "copper",
        cost: { wood: 1, leather: 2 },
        componentCost: { axeHead: { copper: 1 } },
        bonus: { woodGathering: { min: 4, max: 5.5, decimals: 1 } },
      },
    ],
  },
  bow: {
    key: "bow",
    name: "Bow",
    tiers: [
      NO_TOOL,
      {
        name: "crude",
        cost: { wood: 3, fiber: 6 },
        componentCost: {},
        bonus: { range: { min: 130, max: 170 } },
      },
    ],
  },
  shoes: {
    key: "shoes",
    name: "Shoes",
    tiers: [
      NO_TOOL,
      {
        name: "crude",
        cost: { fiber: 2, leather: 5 },
        componentCost: {},
        bonus: { explorationChance: { min: 1, max: 2, decimals: 1 } },
      },
    ],
  },
  knife: {
    key: "knife",
    name: "Knife",
    tiers: [
      NO_TOOL,
      {
        name: "stone",
        cost: { wood: 1, fiber: 1, stone: 4 },
        componentCost: {},
        bonus: { skinning: { min: 1, max: 1.5, decimals: 1 } },
      },
      {
        name: "copper",
        cost: { wood: 1, leather: 2 },
        componentCost: { knifeBlade: { copper: 1 } },
        bonus: { skinning: { min: 1, max: 2, decimals: 1 } },
      },
    ],
  },
  pick: {
    key: "pick",
    name: "Pick",
    tiers: [
      NO_TOOL,
      {
        name: "stone",
        cost: { wood: 2, stone: 8 },
        componentCost: {},
        bonus: {},
        skillBonus: { mining: { min: 3 } },
      },
      {
        name: "copper",
        cost: { wood: 1, leather: 2 },
        componentCost: { pickHead: { copper: 1 } },
        bonus: {},
        skillBonus: { mining: { min: 3, max: 4, decimals: 1 } },
      },
    ],
  },
} as const satisfies Record<ToolType, ToolDefinition>;

// Extract bonus keys for each tool from the definitions
type ToolDefs = typeof TOOL_DEFINITIONS;
type ExtractKeys<T> = T extends object ? keyof T : never;
export type ToolBonusKeys<T extends ToolType> = ExtractKeys<ToolDefs[T]["tiers"][number]["bonus"]>;

export const EQUIPMENT_DEFINITIONS: EquipmentDefinition[] = [
  {
    key: "trap",
    name: "Trap",
    cost: { wood: 2, fiber: 3 },
    maxCount: 3,
  },
];
