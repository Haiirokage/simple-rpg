import type { ResourceStore } from "../resources/types";
import type { ConsumableType, LevelType, ToolType } from "./types";

export type EquipmentDefinition = {
  key: ConsumableType;
  name: string;
  cost: Partial<ResourceStore>;
  maxCount: number;
};

export interface ToolDefinition {
  key: ToolType;
  name: string;
  levels: Record<
    LevelType,
    {
      cost: Partial<ResourceStore>;
      bonus: Partial<Record<"woodGathering", number>>;
    }
  >;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    key: "hatchet",
    name: "Hatchet",
    levels: {
      stone: { cost: { wood: 5, stone: 8 }, bonus: { woodGathering: 3 } },
      none: { cost: {}, bonus: {} },
    },
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
