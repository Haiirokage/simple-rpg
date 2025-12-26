export const consumables = ["trap"] as const;
export type ConsumableType = (typeof consumables)[number];

interface consumableStatus {
  count: number;
  active: number;
}

export const tools = ["hatchet", "bow"] as const;
export type ToolType = (typeof tools)[number];

interface ToolStatus {
  level: number; // 0 = none, 1+ = tier index in definition
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
      level: 0,
    },
    bow: {
      level: 0,
    },
  },
};

export type EquipmentKeyType = ConsumableType | ToolType;
