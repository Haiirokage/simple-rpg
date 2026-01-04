import { useDataQuery, useUpdateData } from "../util";
import type { EncounterStore, EncounterFrameId, SkillCheck } from "./types";
import { useHandleKnowledge } from "../knowledge/hooks";
import { useAttributes } from "../attributes/hooks";
import { useCallback } from "preact/hooks";
import { useGrantSkillExperience, useSkills } from "../skills/hooks";

const defaultEncounterStore: EncounterStore = {
  active: true,
  biome: "forest",
  encounterFrameId: "deer_tracks_found",
} as const;

export const useEncounter = () => {
  return useDataQuery<EncounterStore>("ENCOUNTERS", defaultEncounterStore);
};

export const useUpdateEncounter = () => {
  return useUpdateData<EncounterStore>("ENCOUNTERS", defaultEncounterStore);
};

/**
 * Hook to start an encounter at a specific frame.
 * Sets the encounter as active and sets the initial frame.
 */
export const useSetEncounter = () => {
  const { mutate } = useUpdateEncounter();

  return (startFrameId: EncounterFrameId | "exit") => {
    if (startFrameId === "exit") {
      mutate({
        active: false,
        encounterFrameId: undefined,
      });
      return;
    }
    mutate({
      active: true,
      encounterFrameId: startFrameId,
    });
  };
};

const BONUS_SCALE = 20;
const KNOWLEDGE_SCALE = 50;
/**
 * Hook that returns a function to resolve skill checks.
 * Returns "success" or "failure" based on d20 roll + bonuses vs DC.
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

      const attributeBonus = skillCheck.attribute.reduce((sum, attr) => {
        const level = attributes[attr].level;
        return sum + Math.floor(level / BONUS_SCALE);
      }, 0);

      const skillBonus = skillCheck.skill.reduce((sum, skill) => {
        const { level } = skills[skill];
        return sum + Math.floor(level / BONUS_SCALE);
      }, 0);

      const bonus = knowledgeBonus + attributeBonus + skillBonus;
      const success = roll + bonus >= skillCheck.dc;

      if (success) {
        if (skillBonus > 0) {
          const skillContribution = skillBonus / bonus;
          const expReward = Math.round(Math.pow(1.45, skillCheck.dc) * 2 * skillContribution);
          skillCheck.skill.forEach((skill) => {
            grantExperience({ [skill]: expReward });
          });
        }
        if (knowledgeBonus > 0) {
          const knowledgeContribution = knowledgeBonus / bonus;
          if (skillCheck.dc / 9 >= tier) {
            const levels = 1 + skillCheck.dc / 9 - tier;
            gainLevels(Math.round(levels / knowledgeContribution));
          }
        }
      }
      return success ? "success" : "failure";
    },
    [knowledge, attributes, skills, grantExperience, gainLevels],
  );
};
