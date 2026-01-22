import type { Attributes } from "../data/attributes/types";

export type Creatures = "deer";

export interface BaseNPCDefinition {
  name: string;
  attributes: Record<Attributes, number>;
  targets: Record<"head" | "body" | "legs", { armor_rating: number }>;
}
export interface CreatureDefinition extends BaseNPCDefinition {
  id: Creatures;
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
    id: "deer",
    name: "Deer",
    attributes: {
      strength: 25,
      constitution: 50,
      dexterity: 42,
      wisdom: 1,
    },
    targets: getTargets(30, 15, 10),
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
