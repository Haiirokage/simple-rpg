import type { ResourceStore } from "../resources/types";
import type { ConsumableType, ToolType } from "./types";

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
  bonus: Partial<Record<EquipmentBonusType, NumberRange>>;
}

export interface ToolDefinition {
  key: ToolType;
  name: string;
  tiers: ToolTier[]; // index 0+ are tier names (level 1+), level 0 is always "none"
}

const NO_TOOL = { name: "none", cost: {}, bonus: {} };

export const BOW_DEFINITION: ToolDefinition = {
  key: "bow",
  name: "Bow",
  tiers: [
    NO_TOOL,
    { name: "crude", cost: { wood: 5, fiber: 8 }, bonus: { range: { min: 130, max: 170 } } },
  ],
};
export const TOOL_DEFINITIONS: Record<ToolType, ToolDefinition> = {
  hatchet: {
    key: "hatchet",
    name: "Hatchet",
    tiers: [
      NO_TOOL,
      {
        name: "stone",
        cost: { wood: 5, stone: 8 },
        bonus: { woodGathering: { min: 3, max: 4.5 } },
      },
    ],
  },
  bow: BOW_DEFINITION,
  shoes: {
    key: "shoes",
    name: "Shoes",
    tiers: [
      NO_TOOL,
      {
        name: "crude",
        cost: { fiber: 2, leather: 5 },
        bonus: { explorationChance: { min: 1, max: 2, decimals: 1 } },
      },
    ],
  },
  knife: {
    key: "knife",
    name: "Knife",
    tiers: [
      NO_TOOL,
      { name: "stone", cost: { wood: 2, fiber: 1, stone: 4 }, bonus: { skinning: { min: 1 } } },
    ],
  },
} as const;

export const EQUIPMENT_DEFINITIONS: EquipmentDefinition[] = [
  {
    key: "trap",
    name: "Trap",
    cost: { wood: 10, fiber: 5 },
    maxCount: 3,
  },
];
