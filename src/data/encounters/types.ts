import type { KnowledgeBiome } from "../knowledge/types";
import type { ResourceStore } from "../resources/types";
import type { Skills } from "../skills/types";
import type { CreatureIntance, Creatures } from "../../npc/creature-definitions";
import type { ExtraDiscoveries } from "../discoveries/types";
import type { PlayerEffect } from "../effect-util";
import type { HumanType } from "../../npc/human-definitions";

export interface EncounterNPC {
  type: HumanType;
  id: string;
}

export type EncounterFrameId =
  | "deer_tracks_found"
  | "edable_roots"
  | "wolf_encounter"
  | "npc_encounter";

export interface BaseOutcome {
  resourceYield?: Partial<ResourceStore>;
  discovery?: ExtraDiscoveries;
  sideEffect?: PlayerEffect;
  exitMessage?: string;
}

export interface FrameOutcome extends BaseOutcome {
  nextFrameId: EncounterFrameId | "exit";
}

export interface CombatConfig {
  flavorText: string;
  exitMessage?: string;
  onKill?: Partial<{
    frameId: EncounterFrameId;
    discovery: ExtraDiscoveries;
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
  /** Difficulty class 1-30 ish.
   * A player can get a total of 15 bonus from skills and knowledge + a roll of 1-20.
   * The DC must be set accordingly to provide a balanced challenge. */
  dc: number; // Difficulty class (e.g., 12, 15, 20)
};

export type EncounterOutcomes = {
  failure: Outcome;
} & Record<"success" | number, Outcome>;

export interface BaseAction {
  id: string;
  label: string;
  cost: {
    minutes?: number; // Time cost in minutes
    /** an energy cost will not make it possible to mutate playerStatus in outcome */
    energy?: number; // Optional energy cost
  };
  outcomes: EncounterOutcomes;
}

export interface SkillAction extends BaseAction {
  type: "skill";
  skillCheck: SkillCheck;
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

export type CombatFrameId = "combat";

export interface CombatEncounterFrame extends BaseEncounterFrame {
  id: CombatFrameId;
}

export type EncounterStore = {
  active: boolean;
  biome: KnowledgeBiome;
  encounterFrameId?: EncounterFrameId;
  enemies: Record<string, CreatureIntance>;
  npcs: string[]; // NPC store ids present in this encounter
  combatContext?: CombatConfig;
  timePassed: number; // in minutes
  exitMessage?: string;
};
