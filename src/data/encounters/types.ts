import type { ResourceStore } from "../resources/types";
import type { Skills } from "../skills/types";
import type { CreatureInstance, Creatures } from "../../npc/creature-definitions";
import type { PlayerEffect } from "../effect-util";
import type { HumanType } from "../../npc/human-definitions";
import type { WeaponType } from "../equipment/types";
import type { AllUnlockables, AllBiomeUnlockables } from "../../biome/discovery-types";
import type { ForestEncounterFrameId } from "../../biome/forest/encounter-definitions";
import type { VillageEncounterFrameId } from "../../biome/village/encounter-definitions";

export interface EncounterNPC {
  type: HumanType;
  id: string;
}

export type EncounterFrameId = ForestEncounterFrameId | VillageEncounterFrameId;

export interface BaseOutcome {
  resourceYield?: Partial<ResourceStore>;
  discovery?: AllUnlockables;
  sideEffect?: PlayerEffect;
  exitMessage?: string;
}

export interface FrameOutcome extends BaseOutcome {
  nextFrameId: EncounterFrameId | "exit";
}

export interface CombatConfig {
  flavorText: string;
  exitMessage?: string;
  sparring?: { weapon: WeaponType };
  onKill?: Partial<{
    frameId: EncounterFrameId;
    discovery: AllUnlockables;
  }>;
}

export interface CombatOutcome extends BaseOutcome {
  nextFrameId: "combat";
  spawnCreatures: {
    type: Creatures;
    id: string;
    distance: number;
    hostile?: boolean;
    discovered?: boolean;
  }[];
  combatConfig: CombatConfig;
}

export type Outcome = FrameOutcome | CombatOutcome;
export type SkillCheck = {
  knowledge?: boolean;
  skill: Skills[];
  /** Difficulty class 3-20.
   * Roll is d6 (1-6) + up to ~15 bonus from skills/attributes + a potential knowledge boost
   */
  dc: number;
};

export type EncounterOutcomes = {
  failure: Outcome;
} & Record<"success" | number, Outcome>;

export interface CostType {
  minutes?: number; /** Time cost in minutes */
  energy?: number; /** Optional energy cost */
}

export interface BaseAction {
  label: string;
  cost: CostType;
  outcomes: EncounterOutcomes;
  /** If set, action only shows when discovery matches. Without progress: show if > 0. With progress: show if === progress */
  discoveryRequirement?: { id: AllUnlockables; progress?: number };
}

export interface SkillAction extends BaseAction {
  type: "skill";
  skillCheck: SkillCheck;
  /** Shown instead of label when player has no levels in the skill */
  coverLabel?: string;
}
export interface AttackAction extends BaseAction {
  type: "attack";
  attack: {
    weaponType: "ranged";
    target: string;
  };
}

export type EncounterAction = SkillAction | AttackAction;

export interface BaseEncounterFrame {
  title: string;
  description: string;
  spawnCreatures?: { type: Creatures; id: string; distance: number }[];
  actions: EncounterAction[];
  npc?: EncounterNPC;
  preventLeaving?: boolean; // If true, player cannot leave this frame (default: false)
}
export interface EncounterFrame extends BaseEncounterFrame {
  id: EncounterFrameId;
}

export type EncounterStore = {
  active: boolean;
  encounterFrameId?: EncounterFrameId;
  encounteredDiscovery?: AllBiomeUnlockables;
  enemies: Record<string, CreatureInstance>;
  npcs: string[]; // NPC store ids present in this encounter
  combatContext?: CombatConfig;
  timePassed: number; // in minutes
  exitMessage?: string;
};
