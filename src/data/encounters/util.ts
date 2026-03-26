import { getTarget, type AllTargets, type CreatureInstance } from "../../npc/creature-definitions";
import type { AttributeStore } from "../attributes/types";
import { getAttributeBySkill } from "../skills/definitions";
import type { Skills, SkillStore } from "../skills/types";

export const getBasicNPC = (type: AllTargets, distance = 100): CreatureInstance => {
  const definition = getTarget(type);

  return {
    ...definition,
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

export const getSkillBonus = (level = 0) => Math.floor(Math.sqrt(level));

export const getFullSkillBonus = (
  skill: Skills,
  skills: SkillStore,
  attributes: AttributeStore,
) => {
  const connectedAttribute = getAttributeBySkill(skill);
  const attributeLevel = attributes[connectedAttribute].level;

  return getSkillBonus(skills[skill].level) + Math.floor(attributeLevel / 20);
};
