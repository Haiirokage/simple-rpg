import { getTarget, type AllTargets, type CreatureIntance } from "../../npc/creature-definitions";

export const getBasicNPC = (type: AllTargets, distance = 100): CreatureIntance => {
  const definition = getTarget(type);
  return {
    ...definition,
    type: type as CreatureIntance["type"],
    speedFactor: "speedFactor" in definition ? definition.speedFactor : 0,
    loot: "loot" in definition ? definition.loot : [],
    id: "npc_1",
    distance,
    health: 100,
    maxHealth: 100,
    hostile: false,
    discovered: false,
  };
};
