import type { KnowledgeBiome } from "../knowledge/types";
import type { ResourceStore } from "../resources/types";
import type { Skills } from "../skills/types";
import type { AllTargets, Creatures } from "../../npc/creature-definitions";
import type { ExtraDiscoveries } from "../discoveries/types";

export type EncounterFrameId = "deer_tracks_found" | "deer_spotted" | "deer_killed"; // Add more frame IDs as they're created

export interface Outcome {
  nextFrameId: EncounterFrameId | "exit";
  resourceYield?: Partial<ResourceStore>;
  discovery?: ExtraDiscoveries;
  exitMessage?: string;
}
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

export type EncounterFrame = {
  id: EncounterFrameId;
  title: string;
  description: string;
  spawnCreatures?: { type: Creatures; id: string; distance: number }[];
  actions: EncounterAction[];
  preventLeaving?: boolean; // If true, player cannot leave this frame (default: false)
};

export type NPC = {
  id: string;
  type: AllTargets;
  distance: number; // in meters
  health: number;
  maxHealth: number;
};

export type EncounterStore = {
  active: boolean;
  biome: KnowledgeBiome;
  encounterFrameId?: EncounterFrameId;
  npcs: Record<string, NPC>;
  timePassed: number; // in minutes
  exitMessage?: string;
};
