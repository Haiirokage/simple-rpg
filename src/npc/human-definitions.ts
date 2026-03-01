import type { ToolStatus, ToolType } from "../data/equipment/types";
import type { ResourceCost } from "../data/resources/types";
import type { BiomeType } from "../biome/discovery-types";

export type HumanType = "barmaid" | "blacksmith";

export interface NPCHome {
  biome: BiomeType;
  location?: string;
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
  interestValues: ResourceCost; // resource → intrinsic coin value per unit
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
    interestValues: { wood: 3, jar: 5 },
    replenishment: { jar: 1 },
    sellList: [{ type: "tool", tool: "knife", price: 15 }],
  },
  blacksmith: {
    id: "blacksmith",
    sex: "male",
    age: { min: 30, max: 50 },
    home: { biome: "village", location: "blacksmith" },
    equipment: {},
    allowance: 180,
    // TODO: add craft components (bars, cast parts) to trading
    interestValues: { copperOre: 10, charcoal: 5 },
    replenishment: { charcoal: 20 },
    sellList: [],
  },
};
