import type { KnowledgeBiome } from "../knowledge/types";
import type { Attributes } from "../attributes/types";
import type { ResourceStore } from "../resources/types";
import type { Skills } from "../skills/types";
import type { Creatures } from "../../npc/creature-definitions";

export type EncounterFrameId = "deer_tracks_found" | "deer_spotted" | "deer_killed"; // Add more frame IDs as they're created
interface Outcome {
  nextFrameId: EncounterFrameId | "exit";
  resourceYield?: Partial<ResourceStore>;
}
export type SkillCheck = {
  knowledge?: boolean;
  attribute: Attributes[]; // e.g., ["strength"]
  skill: Skills[];
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
  type: Creatures;
  distance: number; // in meters
  health: number;
  maxHealth: number;
};

export type EncounterStore = {
  active: boolean;
  biome: KnowledgeBiome;
  encounterFrameId?: EncounterFrameId;
  npcs: Record<string, NPC>;
};
