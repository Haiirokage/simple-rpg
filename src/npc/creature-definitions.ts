import type { Attributes } from "../data/attributes/types";
import type { ResourceStore } from "../data/resources/types";

export type Creatures = "deer" | "wolf";

export interface LootEntry {
  resources: Partial<ResourceStore>;
  dc?: number;
}

export interface BaseNPCDefinition {
  name: string;
  attributes: Record<Attributes, number>;
  targets: Record<"head" | "body" | "legs", { armor_rating: number }>;
}
export interface CreatureDefinition extends BaseNPCDefinition {
  type: Creatures;
  speedFactor: number; // species speed multiplier: cbrt(dex) * speedFactor = m/s
  loot: LootEntry[];
}

export interface CreatureIntance extends CreatureDefinition {
  id: string;
  distance: number;
  health: number;
  maxHealth: number;
  hostile: boolean;
  discovered: boolean;
}

const getTargets = (head = 0, body = 0, legs = 0) => {
  return {
    head: { armor_rating: head },
    body: { armor_rating: body },
    legs: { armor_rating: legs },
  };
};

export const CREATURES: Record<Creatures, CreatureDefinition> = {
  deer: {
    type: "deer",
    name: "Deer",
    speedFactor: 4.5,
    attributes: {
      strength: 25,
      constitution: 50,
      dexterity: 40,
      wisdom: 1,
    },
    targets: getTargets(30, 15, 10),
    loot: [{ resources: { venison: 15 } }, { resources: { hide: 1, venison: 5 }, dc: 9 }],
  },
  wolf: {
    type: "wolf",
    name: "Wolf",
    speedFactor: 5,
    attributes: {
      strength: 35,
      constitution: 40,
      dexterity: 50,
      wisdom: 8,
    },
    targets: getTargets(12, 10, 8),
    loot: [{ resources: { fur: 1 } }],
  },
};

export type OtherTargets = "archeryTarget";

export interface OtherTargetDefinition extends BaseNPCDefinition {
  id: OtherTargets;
}

export const OTHER_TARGETS: Record<OtherTargets, OtherTargetDefinition> = {
  archeryTarget: {
    id: "archeryTarget",
    name: "Archery Target",
    attributes: {
      strength: 0,
      constitution: 10,
      dexterity: 0,
      wisdom: 0,
    },
    targets: getTargets(15, 15, 15),
  },
};

export type AllTargets = Creatures | OtherTargets;

export const getTarget = (id: AllTargets) => {
  if (id in CREATURES) {
    return CREATURES[id as Creatures];
  } else {
    return OTHER_TARGETS[id as OtherTargets];
  }
};
