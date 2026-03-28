import type { ResourceStore } from "../resources/types";
import type { Skills } from "../skills/types";
import type { ConsumableType, ToolType, WeaponType } from "./types";
import type { ComponentCost } from "../craftComponents/types";

export type EquipmentDefinition = {
  key: ConsumableType;
  name: string;
  cost: Partial<ResourceStore>;
  maxCount: number;
};

export interface NumberRange {
  min: number;
  max?: number;
  decimals?: number;
}

export type EquipmentBonusType = "woodGathering" | "explorationChance" | "skinning";

export interface ToolTier {
  name: string; // e.g. "wooden", "stone", "iron"
  cost: Partial<ResourceStore>;
  componentCost: ComponentCost;
  bonus: Partial<Record<EquipmentBonusType, NumberRange>>;
  skillBonus?: Partial<Record<Skills, NumberRange>>;
}

export interface ToolDefinition {
  key: ToolType;
  name: string;
  tiers: ToolTier[]; // index 0+ are tier names (level 1+), level 0 is always "none"
}

const NO_TOOL = { name: "none", cost: {}, componentCost: {}, bonus: {} };

export const TOOL_DEFINITIONS = {
  hatchet: {
    key: "hatchet",
    name: "Hatchet",
    tiers: [
      NO_TOOL,
      {
        name: "stone",
        cost: { wood: 2, stone: 8 },
        componentCost: {},
        bonus: { woodGathering: { min: 2, max: 3.5, decimals: 1 } },
      },
      {
        name: "copper",
        cost: { wood: 1, leather: 2 },
        componentCost: { axeHead: { copper: 1 } },
        bonus: { woodGathering: { min: 3, max: 4.5, decimals: 1 } },
      },
    ],
  },
  bow: {
    key: "bow",
    name: "Bow",
    tiers: [
      NO_TOOL,
      {
        name: "crude",
        cost: { wood: 3, fiber: 6 },
        componentCost: {},
        bonus: {},
      },
    ],
  },
  shoes: {
    key: "shoes",
    name: "Shoes",
    tiers: [
      NO_TOOL,
      {
        name: "crude",
        cost: { fiber: 2, leather: 5 },
        componentCost: {},
        bonus: { explorationChance: { min: 1, max: 2, decimals: 1 } },
      },
    ],
  },
  knife: {
    key: "knife",
    name: "Knife",
    tiers: [
      NO_TOOL,
      {
        name: "stone",
        cost: { wood: 1, fiber: 1, stone: 4 },
        componentCost: {},
        bonus: { skinning: { min: 1, max: 1.5, decimals: 1 } },
      },
      {
        name: "copper",
        cost: { wood: 1, leather: 2 },
        componentCost: { knifeBlade: { copper: 1 } },
        bonus: { skinning: { min: 1.2, max: 1.8, decimals: 1 } },
      },
    ],
  },
  pick: {
    key: "pick",
    name: "Pick",
    tiers: [
      NO_TOOL,
      {
        name: "stone",
        cost: { wood: 2, stone: 8 },
        componentCost: {},
        bonus: {},
        skillBonus: { mining: { min: 3 } },
      },
      {
        name: "copper",
        cost: { wood: 1, leather: 2 },
        componentCost: { pickHead: { copper: 1 } },
        bonus: {},
        skillBonus: { mining: { min: 3, max: 4, decimals: 1 } },
      },
    ],
  },
  staff: {
    key: "staff",
    name: "Staff",
    tiers: [
      NO_TOOL,
      {
        name: "crude",
        cost: { wood: 4 },
        componentCost: {},
        bonus: {},
      },
    ],
  },
} as const satisfies Record<ToolType, ToolDefinition>;

// Extract bonus keys for each tool from the definitions
type ToolDefs = typeof TOOL_DEFINITIONS;
type ExtractKeys<T> = T extends object ? keyof T : never;
export type ToolBonusKeys<T extends ToolType> = ExtractKeys<ToolDefs[T]["tiers"][number]["bonus"]>;

export type AttackMode = "strike" | "stab" | "throw";
export type DamageType = "blunt" | "pierce" | "slash" | "cleave";

// --- Melee ---

export interface MeleeTier {
  name: string;
  hardness: NumberRange; // material quality, scales with level
}

export interface MeleeWeaponDefinition {
  key: WeaponType;
  name: string;
  class: "melee";
  length: number; // reach in meters, constant across tiers
  attacks: Partial<Record<AttackMode, DamageType>>; // e.g. { strike: "blunt", stab: "pierce" }
  tiers: Record<number, MeleeTier>; // tier 0 absent = no weapon equipped
}

// --- Projectile (bow, crossbow) ---

export interface ProjectileTier {
  name: string;
  range: NumberRange;
  strengthRequired?: number;
}

export interface ProjectileWeaponDefinition {
  key: WeaponType;
  name: string;
  class: "projectile";
  tiers: Record<number, ProjectileTier>; // tier 0 absent = no weapon equipped
}

export type WeaponDefinition = MeleeWeaponDefinition | ProjectileWeaponDefinition;

// Resolved stats — NumberRange fields replaced with number for the current tier/level
export type ResolvedMeleeTier = { name: string; hardness: number };
export type ResolvedProjectileTier = { name: string; range: number; strengthRequired?: number };

export type MeleeWeaponStats = Omit<MeleeWeaponDefinition, "tiers"> & {
  tier: ResolvedMeleeTier | undefined;
};
export type ProjectileWeaponStats = Omit<ProjectileWeaponDefinition, "tiers"> & {
  tier: ResolvedProjectileTier | undefined;
};

export const WEAPON_DEFINITIONS: { bow: ProjectileWeaponDefinition; staff: MeleeWeaponDefinition } =
  {
    bow: {
      key: "bow",
      name: "Bow",
      class: "projectile",
      tiers: {
        1: { name: "crude", range: { min: 130, max: 170 } },
      },
    },
    staff: {
      key: "staff",
      name: "Staff",
      class: "melee",
      length: 1.8,
      attacks: { strike: "blunt", stab: "blunt" },
      tiers: {
        1: { name: "wooden", hardness: { min: 1, max: 3 } },
      },
    },
  };

export const EQUIPMENT_DEFINITIONS: EquipmentDefinition[] = [
  {
    key: "trap",
    name: "Trap",
    cost: { wood: 2, fiber: 3 },
    maxCount: 3,
  },
];
