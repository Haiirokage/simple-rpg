import type { ToolStatus, ToolType } from "../data/equipment/types";
import type { ResourceCost, ResourceKeys } from "../data/resources/types";
import type { BiomeType } from "../biome/discovery-types";

export type HumanType = "barmaid" | "blacksmith";

export interface NPCHome {
  biome: BiomeType;
  location?: string;
}

export interface ResourceInterest {
  resource: ResourceKeys;
  value: number; // intrinsic coin value per unit — actual trade prices apply a bid/ask spread
}

export interface ToolSellEntry {
  type: "tool";
  tool: ToolType;
  price: number;
}

export interface HumanDefinition {
  id: HumanType;
  sex?: "male" | "female";
  age: { min: number; max: number };
  home?: NPCHome;
  equipment: Partial<Record<ToolType, ToolStatus>>;
  allowance: number; // coin received per month
  interests: ResourceInterest[]; // resources the NPC will buy and sell
  replenishment: ResourceCost; // resources added to inventory each month (also used as initial stock)
  sellList: ToolSellEntry[]; // tools the NPC will sell
}

export const HUMAN_DEFINITIONS: Record<HumanType, HumanDefinition> = {
  barmaid: {
    id: "barmaid",
    sex: "female",
    age: { min: 18, max: 30 },
    home: { biome: "village", location: "tavern" },
    equipment: { knife: { tier: 2, level: 7 } },
    allowance: 40,
    interests: [
      { resource: "wood", value: 3 },
      { resource: "jar", value: 5 },
    ],
    replenishment: { jar: 1 },
    sellList: [{ type: "tool", tool: "knife", price: 15 }],
  },
  blacksmith: {
    id: "blacksmith",
    sex: "male",
    age: { min: 30, max: 50 },
    home: { biome: "village", location: "blacksmith" },
    equipment: {},
    allowance: 200,
    interests: [
      { resource: "copperOre", value: 10 },
      { resource: "charcoal", value: 5 },
    ],
    replenishment: { charcoal: 10 },
    sellList: [],
  },
};
