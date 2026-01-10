import { useDataQuery, useUpdateData } from "../util";
import type { EncounterStore, EncounterFrameId, SkillCheck, NPC } from "./types";
import { ENCOUNTER_FRAMES } from "./definitions";
import { useHandleKnowledge } from "../knowledge/hooks";
import { useAttributes } from "../attributes/hooks";
import { useCallback } from "preact/hooks";
import { useGrantSkillExperience, useSkills } from "../skills/hooks";
import { getAttributeBySkill } from "../skills/definitions";
import { useAdvanceTime } from "../time/hooks";

const defaultEncounterStore: EncounterStore = {
  active: false,
  biome: "forest",
  npcs: {},
  timePassed: 0,
} as const;

export const useEncounter = () => {
  return useDataQuery<EncounterStore>("ENCOUNTERS", defaultEncounterStore);
};

export const useUpdateEncounter = () => {
  return useUpdateData<EncounterStore>("ENCOUNTERS", defaultEncounterStore);
};

export const useHandleEncounter = () => {
  const { data: encounter } = useEncounter();
  const { mutate } = useUpdateEncounter();

  return { encounter, mutateEncounter: mutate };
};

/**
 * Generate NPC instances from spawnCreatures config.
 */
const spawnNpcsFromFrame = (frameId: EncounterFrameId) => {
  const frame = ENCOUNTER_FRAMES[frameId];
  if (!frame.spawnCreatures) return {};

  return frame.spawnCreatures.reduce(
    (npcs, config) => ({
      ...npcs,
      [config.id]: {
        id: config.id,
        type: config.type,
        distance: config.distance,
        health: 100,
        maxHealth: 100,
      },
    }),
    {} as Record<string, NPC>,
  );
};

/**
 * Hook to start an encounter at a specific frame.
 * Sets the encounter as active and sets the initial frame.
 */
export const useSetEncounter = () => {
  const { mutateEncounter, encounter } = useHandleEncounter();
  const advanceTime = useAdvanceTime();

  return (startFrameId: EncounterFrameId | "exit", timePassed?: number, exitMessage?: string) => {
    const timePassedTotal = encounter.timePassed + (timePassed || 0);
    if (startFrameId === "exit") {
      const hoursPassed = Math.round(timePassedTotal / 60);
      if (hoursPassed > 0) {
        advanceTime(hoursPassed);
      }
      mutateEncounter({
        active: false,
        encounterFrameId: undefined,
        npcs: {},
        timePassed: 0,
        exitMessage: exitMessage,
      });

      return;
    }
    mutateEncounter({
      active: true,
      encounterFrameId: startFrameId,
      npcs: spawnNpcsFromFrame(startFrameId),
      timePassed: timePassedTotal,
      exitMessage: undefined,
    });
  };
};

const KNOWLEDGE_SCALE = 50;
/**
 * Hook that returns a function to resolve skill checks.
 * Returns "success" or "failure" based on d20 roll + bonuses vs DC.
 *
 * bonus from levels(1-100) is sqrt(level) / 2, this gives the same 5 bonus at level 100 as level / 20, but earlier levels give a larger bonus
 */
export const useHandleSkillCheck = () => {
  const { data } = useEncounter();
  const { biome } = data;
  const { knowledge, gainLevels } = useHandleKnowledge(biome);
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const { attributes } = useAttributes();

  return useCallback(
    (skillCheck: SkillCheck): "success" | "failure" => {
      const roll = Math.floor(Math.random() * 20) + 1;

      const { level, tier } = knowledge;
      const score = tier * 100 + level;
      const knowledgeBonus = skillCheck.knowledge ? Math.floor(score / KNOWLEDGE_SCALE) : 0;

      const skillBonus = skillCheck.skill.reduce((sum, skill) => {
        const connectedAttribute = getAttributeBySkill(skill);
        const attributeLevel = attributes[connectedAttribute].level;
        const { level } = skills[skill];
        return sum + Math.floor(Math.sqrt(level) / 2) + attributeLevel / 20;
      }, 0);

      const bonus = knowledgeBonus + skillBonus;
      const success = roll + bonus >= skillCheck.dc;

      console.info(`Roll:${roll} + Bonus:${bonus} vs DC:${skillCheck.dc}`);
      if (success) {
        const skillContribution = Math.max(0.1, skillBonus / bonus);
        const expReward = Math.round(Math.pow(1.45, skillCheck.dc) * 2 * skillContribution);
        skillCheck.skill.forEach((skill) => {
          console.info(`Gained ${expReward} exp in ${skill} skill.`);
          grantExperience({ [skill]: expReward });
        });
        const knowledgeContribution = Math.max(0.1, knowledgeBonus / bonus);
        if (skillCheck.dc / 9 >= tier) {
          const levels = 1 + skillCheck.dc / 9 - tier;
          console.info(`Gained ${Math.round(levels / knowledgeContribution)} knowledge levels.`);
          gainLevels(Math.round(levels / knowledgeContribution));
        }
      }
      return success ? "success" : "failure";
    },
    [knowledge, attributes, skills, grantExperience, gainLevels],
  );
};
