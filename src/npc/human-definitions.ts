import type { ToolStatus, ToolType } from "../data/equipment/types";
import type { ResourceCost, ResourceKeys } from "../data/resources/types";

export type HumanType = "barmaid";

export interface BudgetEntry {
  resource: ResourceKeys;
  price: number; // coin per unit
}

export interface SellEntry {
  tool: ToolType;
  price: number;
}

export interface HumanDefinition {
  id: HumanType;
  sex?: "male" | "female";
  age: { min: number; max: number };
  equipment: Partial<Record<ToolType, ToolStatus>>;
  resources: ResourceCost;
  allowance: number; // coin received per month
  budget: BudgetEntry[];
  sellList: SellEntry[];
}

export const HUMAN_DEFINITIONS: Record<HumanType, HumanDefinition> = {
  barmaid: {
    id: "barmaid",
    sex: "female",
    age: { min: 18, max: 30 },
    equipment: { knife: { tier: 2, level: 7 } },
    resources: {},
    allowance: 20,
    budget: [{ resource: "wood", price: 3 }],
    sellList: [{ tool: "knife", price: 15 }],
  },
};
