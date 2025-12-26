import type { ResourceStore } from "../resources/types";
import type { ConsumableType, ToolType } from "./types";

export type EquipmentDefinition = {
  key: ConsumableType;
  name: string;
  cost: Partial<ResourceStore>;
  maxCount: number;
};

export interface ToolTier {
  name: string; // e.g. "wooden", "stone", "iron"
  cost: Partial<ResourceStore>;
  bonus: Partial<Record<"woodGathering", number>>;
}

export interface ToolDefinition {
  key: ToolType;
  name: string;
  tiers: ToolTier[]; // index 0+ are tier names (level 1+), level 0 is always "none"
}

const NO_TOOL = { name: "none", cost: {}, bonus: {} };

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    key: "hatchet",
    name: "Hatchet",
    tiers: [NO_TOOL, { name: "stone", cost: { wood: 5, stone: 8 }, bonus: { woodGathering: 3 } }],
  },
  {
    key: "bow",
    name: "Bow",
    tiers: [NO_TOOL, { name: "crude", cost: { wood: 5, fiber: 10 }, bonus: {} }],
  },
];

export const EQUIPMENT_DEFINITIONS: EquipmentDefinition[] = [
  {
    key: "trap",
    name: "Trap",
    cost: { wood: 10, fiber: 5 },
    maxCount: 3,
  },
];
