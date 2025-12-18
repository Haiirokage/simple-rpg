export const consumables = ["trap"] as const;
export type ConsumableType = (typeof consumables)[number];

interface consumableStatus {
  count: number;
  active: number;
}

export const tools = ["hatchet"] as const;
export type ToolType = (typeof tools)[number];

export const toolLevels = ["none", "stone"] as const;
export type LevelType = (typeof toolLevels)[number];

interface ToolStatus {
  level: LevelType;
}

export type EquipmentStore = {
  consumables: Record<(typeof consumables)[number], consumableStatus>;
  tools: Record<(typeof tools)[number], ToolStatus>;
};

export const defaultEquipmentStore: EquipmentStore = {
  consumables: {
    trap: {
      count: 0,
      active: 0,
    },
  },
  tools: {
    hatchet: {
      level: "none",
    },
  },
};

export type EquipmentKeyType = ConsumableType | ToolType;
