import type { HumanType, HumanDefinition, NPCHome, Schedule } from "./creature-types";

export type {
  HumanType,
  HumanDefinition,
  NPCHome,
  Schedule,
  ToolSellEntry,
} from "./creature-types";

export type NPCSchedules = Partial<Record<HumanType, Schedule>>;

/** Returns where an NPC is scheduled to be at a given hour, wrapping to the last entry if before the first scheduled time */
export const getScheduledLocation = (schedule: Schedule, hour: number): NPCHome | undefined => {
  const allKeys = Object.keys(schedule).map(Number).reverse();
  if (allKeys.length === 0) return undefined;
  const validKeys = allKeys.filter((h) => h <= hour);
  return schedule[validKeys.length > 0 ? validKeys[0] : allKeys[0]];
};

export const NPC_SCHEDULES: NPCSchedules = {
  barmaid: {
    11: { biome: "village", location: "tavern" },
    22: { biome: "village" },
  },
  miller: {
    6: { biome: "village" },
    19: { biome: "village", location: "abandoned_field" },
    23: { biome: "village" },
  },
};

export const HUMAN_DEFINITIONS: Record<HumanType, HumanDefinition> = {
  barmaid: {
    id: "barmaid",
    sex: "female",
    age: { min: 18, max: 30 },
    home: { biome: "village", location: "tavern" },
    attributes: {
      strength: 15,
      constitution: 15,
      dexterity: 25,
      wisdom: 20,
      intelligence: 20,
      charisma: 30,
    },
    equipment: { knife: { tier: 2, level: 7 } },
    allowance: 40,
    interestValues: { firewood: 3, jar: 5 },
    replenishment: { jar: 1 },
    sellList: [{ type: "tool", tool: "knife", price: 15 }],
  },
  blacksmith: {
    id: "blacksmith",
    sex: "male",
    age: { min: 30, max: 50 },
    home: { biome: "village", location: "blacksmith" },
    attributes: {
      strength: 45,
      constitution: 35,
      dexterity: 30,
      wisdom: 25,
      intelligence: 20,
      charisma: 15,
    },
    equipment: {},
    allowance: 180,
    interestValues: { copperOre: 10, charcoal: 5 },
    replenishment: { charcoal: 20 },
    sellList: [],
  },
  miller: {
    id: "miller",
    sex: "male",
    age: { min: 30, max: 55 },
    home: { biome: "village" },
    attributes: {
      strength: 35,
      constitution: 30,
      dexterity: 35,
      wisdom: 20,
      intelligence: 15,
      charisma: 20,
    },
    equipment: {},
    allowance: 60,
    interestValues: {},
    replenishment: {},
    sellList: [],
    sparringThreshold: { staff: 50 },
  },
};
