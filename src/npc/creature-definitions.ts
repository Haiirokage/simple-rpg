import type { Attributes } from "../data/attributes/types";

export type Creatures = "deer";

export type CreatureDefinition = {
  id: Creatures;
  name: string;
  attributes: Record<Attributes, number>;
  targets: Record<"head" | "body" | "legs", { armor_rating: number }>;
};

export const CREATURES: Record<Creatures, CreatureDefinition> = {
  deer: {
    id: "deer",
    name: "Deer",
    attributes: {
      strength: 25,
      constitution: 50,
      dexterity: 42,
    },
    targets: {
      head: {
        armor_rating: 30,
      },
      body: {
        armor_rating: 15,
      },
      legs: {
        armor_rating: 10,
      },
    },
  },
};
