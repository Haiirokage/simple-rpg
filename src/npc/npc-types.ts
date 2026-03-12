import type { Attributes } from "../data/attributes/types";
import type { ToolType, ToolStatus } from "../data/equipment/types";
import type { ResourceCost } from "../data/resources/types";
import type { HumanType, ToolSellEntry, NPCHome, Schedule } from "./human-definitions";

export interface HumanInstance {
  id: string;
  type: HumanType;
  name: string;
  sex: "male" | "female";
  age: number;
  home?: NPCHome;
  schedule: Schedule;
  attributes: Record<Attributes, number>;
  equipment: Partial<Record<ToolType, ToolStatus>>;
  resources: ResourceCost;
  allowance: number;
  interestValues: ResourceCost;
  sellList: ToolSellEntry[];
  /** -100: Openly hostile, 0: neutral, 100: complete trust */
  trust: number;
}

export type NPCStore = Record<string, HumanInstance>;

export const defaultNPCStore: NPCStore = {};
