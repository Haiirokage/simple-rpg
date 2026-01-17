export const consumables = ["trap"] as const;
export type ConsumableType = (typeof consumables)[number];

interface consumableStatus {
  count: number;
  active: number;
}

export const tools = ["hatchet", "bow"] as const;
export type ToolType = (typeof tools)[number];

export type BowType = "crude" | "stone";

interface ToolStatus {
  type: BowType;
  level: number; // 0 = none, 1+ = tier index in definition
}

export type EquipmentStore = {
  consumables: Record<(typeof consumables)[number], consumableStatus>;
  tools: Partial<Record<ToolType, ToolStatus>>;
};

export const defaultEquipmentStore: EquipmentStore = {
  consumables: {
    trap: {
      count: 0,
      active: 0,
    },
  },
  tools: {},
};

export type EquipmentKeyType = ConsumableType | ToolType;
