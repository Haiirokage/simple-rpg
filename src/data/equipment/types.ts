export const consumables = ["trap", "lantern"] as const;
export type ConsumableType = (typeof consumables)[number];

interface ConsumableStatus {
  current: number;
  max?: number;
}

export const tools = ["hatchet", "knife", "bow", "shoes", "pick", "staff"] as const;
export type ToolType = (typeof tools)[number];

export type BowType = "crude" | "stone";

export type WeaponType = Extract<ToolType, "bow" | "staff">;

export interface ToolStatus {
  tier: number; // 0 = none, 1+ = tier index in definition
  level: number; // 1-100, decides scaling of stats
}

export type EquipmentStore = {
  consumables: Partial<Record<ConsumableType, ConsumableStatus>>;
  tools: Partial<Record<ToolType, ToolStatus>>;
};

export const defaultEquipmentStore: EquipmentStore = {
  consumables: {},
  tools: {
    shoes: { level: 1, tier: 1 },
  },
};

export type EquipmentKeyType = ConsumableType | ToolType;
