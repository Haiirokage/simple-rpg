import type { KnowledgeTier } from "./types";

export interface TierDefinition {
  tier: KnowledgeTier;
  name: string;
  description: string;
}

export const TIER_DEFINITIONS: TierDefinition[] = [
  {
    tier: 0,
    name: "Alien",
    description: "The area is completely unfamiliar and impossibly difficult to navigate.",
  },
  {
    tier: 1,
    name: "Traversable",
    description: "You can navigate the area, but many techniques remain unfamiliar.",
  },
  {
    tier: 2,
    name: "Familiar",
    description: "You know the area well and can handle most tasks with confidence.",
  },
  {
    tier: 3,
    name: "Master",
    description: "You have mastered the area and understand its secrets.",
  },
];
