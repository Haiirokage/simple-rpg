import { useDataQuery, useUpdateData } from "../util";
import type { EncounterStore, EncounterFrameId, SkillCheck } from "./types";
import { useKnowledge } from "../knowledge/hooks";
import { useAttributes } from "../attributes/hooks";
import { useCallback } from "preact/hooks";
import { useSkills } from "../skills/hooks";

const defaultEncounterStore: EncounterStore = {
  active: true,
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
  const { knowledge } = useKnowledge();
  const { skills } = useSkills();
  const { attributes } = useAttributes();

  return useCallback(
    (skillCheck: SkillCheck): "success" | "failure" => {
      const roll = Math.floor(Math.random() * 20) + 1;

      const knowledgeBonus = skillCheck.knowledge.reduce((sum, biome) => {
        const { level, tier } = knowledge[biome];
        const score = tier * 100 + level;
        return sum + Math.floor(score / KNOWLEDGE_SCALE);
      }, 0);

      const attributeBonus = skillCheck.attribute.reduce((sum, attr) => {
        const level = attributes[attr].level;
        return sum + Math.floor(level / BONUS_SCALE);
      }, 0);

      const skillBonus = skillCheck.skill.reduce((sum, skill) => {
        const { level } = skills[skill];
        return sum + Math.floor(level / BONUS_SCALE);
      }, 0);

      const total = roll + knowledgeBonus + attributeBonus + skillBonus;
      return total >= skillCheck.dc ? "success" : "failure";
    },
    [knowledge, attributes, skills],
  );
};
