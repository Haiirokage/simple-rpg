import type { AllTargets } from "../../npc/creature-definitions";
import type { NPC } from "./types";

export const getBasicNPC = (type: AllTargets, distance = 100): NPC => {
  return {
    id: "npc_1",
    type,
    distance,
    health: 100,
    maxHealth: 100,
  };
};
