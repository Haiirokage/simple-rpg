import type { Creatures, CreatureDefinition } from "./creature-types";

// Re-export for any existing imports from this file
export type { Creatures, CreatureDefinition, CreatureInstance, LootEntry } from "./creature-types";

const getTargets = (head = 0, body = 0, legs = 0) => ({
  head: { armor_rating: head },
  body: { armor_rating: body },
  legs: { armor_rating: legs },
});

export const CREATURES: Record<Creatures, CreatureDefinition> = {
  human: {
    name: "Human",
    speedFactor: 3,
    attributes: {
      strength: 20,
      constitution: 20,
      dexterity: 20,
      wisdom: 20,
      intelligence: 20,
      charisma: 20,
    },
    targets: getTargets(2, 1, 1),
    loot: [],
  },
  deer: {
    name: "Deer",
    speedFactor: 4.5,
    attributes: {
      strength: 25,
      constitution: 50,
      dexterity: 40,
      wisdom: 1,
      intelligence: 1,
      charisma: 1,
    },
    targets: getTargets(30, 15, 10),
    loot: [{ resources: { venison: 15 } }, { resources: { hide: 1, venison: 5 }, dc: 9 }],
  },
  wolf: {
    name: "Wolf",
    speedFactor: 5,
    attributes: {
      strength: 35,
      constitution: 40,
      dexterity: 50,
      wisdom: 8,
      intelligence: 1,
      charisma: 1,
    },
    targets: getTargets(12, 10, 8),
    loot: [{ resources: { fur: 1 } }],
  },
};

export type OtherTargets = "archeryTarget";

export interface OtherTargetDefinition {
  id: OtherTargets;
  name: string;
  attributes: Record<string, number>;
  targets: Record<"head" | "body" | "legs", { armor_rating: number }>;
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
      intelligence: 0,
      charisma: 0,
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
