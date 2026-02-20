import type { ToolStatus, ToolType } from "../data/equipment/types";
import type { ResourceCost, ResourceKeys } from "../data/resources/types";
import type { BiomeType } from "../biome/discovery-types";

export type HumanType = "barmaid" | "blacksmith";

export interface NPCHome {
  biome: BiomeType;
  location?: string;
}

export interface BudgetEntry {
  resource: ResourceKeys;
  price: number; // coin per unit
}

export interface ToolSellEntry {
  type: "tool";
  tool: ToolType;
  price: number;
}

export interface ResourceSellEntry {
  type: "resource";
  resource: ResourceKeys;
  price: number;
  stock: number;
}

export type SellEntry = ToolSellEntry | ResourceSellEntry;

export interface HumanDefinition {
  id: HumanType;
  sex?: "male" | "female";
  age: { min: number; max: number };
  home?: NPCHome;
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
    home: { biome: "village", location: "tavern" },
    equipment: { knife: { tier: 2, level: 7 } },
    resources: {},
    allowance: 40,
    budget: [{ resource: "wood", price: 2 }],
    sellList: [
      { type: "tool", tool: "knife", price: 15 },
      { type: "resource", resource: "jar", price: 5, stock: 1 },
    ],
  },
  blacksmith: {
    id: "blacksmith",
    sex: "male",
    age: { min: 30, max: 50 },
    home: { biome: "village", location: "blacksmith" },
    equipment: {},
    resources: {},
    allowance: 100,
    budget: [{ resource: "copperOre", price: 8 }],
    sellList: [],
  },
};
