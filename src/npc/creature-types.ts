import type { Attributes } from "../data/attributes/types";
import type { ResourceCost } from "../data/resources/types";
import type { ResourceStore } from "../data/resources/types";
import type { ToolType, ToolStatus, WeaponType } from "../data/equipment/types";
import type { BiomeType } from "../biome/discovery-types";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export interface LootEntry {
  resources: Partial<ResourceStore>;
  dc?: number;
}

export interface NPCHome {
  biome: BiomeType;
  location?: string;
}

export type Schedule = Partial<Record<number, NPCHome>>;

export interface ToolSellEntry {
  type: "tool";
  tool: ToolType;
  price: number;
}

// ---------------------------------------------------------------------------
// Creature types
// ---------------------------------------------------------------------------

export type Creatures = "deer" | "wolf" | "human";

/**
 * Static blueprint for a creature species.
 * Defines what makes one species unique from another: how it moves, fights, and what it yields.
 */
export interface CreatureDefinition {
  name: string;
  attributes: Record<Attributes, number>;
  targets: Record<"head" | "body" | "legs", { armor_rating: number }>;
  speedFactor: number;
  loot: LootEntry[];
}

/**
 * Runtime state of a creature.
 * Extends the definition with everything that shifts as the creature interacts with the game.
 */
export interface CreatureInstance extends CreatureDefinition {
  id: string;
  health: number;
  maxHealth: number;
  distance: number;
  hostile: boolean;
  discovered: boolean;
}

// ---------------------------------------------------------------------------
// Human types
// ---------------------------------------------------------------------------

export type HumanType = "barmaid" | "blacksmith" | "miller";

/**
 * Static blueprint for an NPC role.
 * Defines what makes a barmaid different from a miller.
 * Attributes are role-specific (a miller is stronger and more dexterous than a barmaid).
 * Species-level stats (speed, armor) come from the human CreatureDefinition in creature-definitions.ts.
 */
export interface HumanDefinition {
  id: HumanType;
  sex?: "male" | "female";
  age: { min: number; max: number };
  home?: NPCHome;
  attributes: Record<Attributes, number>;
  equipment: Partial<Record<ToolType, ToolStatus>>;
  allowance: number;
  interestValues: ResourceCost;
  replenishment: ResourceCost;
  sellList: ToolSellEntry[];
  /** Weapon → minimum score required to spar with that weapon. Absent means never spars. */
  sparringThreshold?: Partial<Record<WeaponType, number>>;
}

/**
 * Full runtime state of an NPC.
 * The most complete type — a superset of CreatureInstance that also carries
 * the social and economic state an NPC has in the world.
 */
export interface HumanInstance extends CreatureInstance {
  type: HumanType;
  sex: "male" | "female";
  age: number;
  schedule: Schedule;
  equipment: Partial<Record<ToolType, ToolStatus>>;
  resources: ResourceCost;
  sellList: ToolSellEntry[];
  /** -100: openly hostile, 0: neutral, 100: complete trust */
  trust: number;
  definition: HumanDefinition;
}
