import { useDataQuery, useUpdateData } from "../util";
import type { Skills, SkillStore } from "./types";
import { useCallback } from "preact/hooks";
import { objectEntries } from "../../util";
import { levelUpRecursively } from "../leveling-util";
import { getAttributeBySkill } from "./definitions";
import type { AttributeStore } from "../attributes/types";
import { useAttributes, useMutateAttributes } from "../attributes/hooks";

const defaultSkill = { level: 0, exp: 0 };
const defaultSkillStore: SkillStore = {
  hunter: {
    level: 10,
    exp: 0,
  },
  ranged: { ...defaultSkill },
  crafting: { ...defaultSkill },
} as const;

export const useSkills = () => {
  const { data } = useDataQuery<SkillStore>("SKILLS", defaultSkillStore);
  return {
    skills: data,
  };
};

export const useUpdateSkills = () => {
  return useUpdateData<SkillStore>("SKILLS", defaultSkillStore);
};

export const useHandleSkills = () => {
  const { skills } = useSkills();
  const { mutate } = useUpdateSkills();

  return { skills, mutateSkills: mutate };
};

export const useGrantSkillExperience = () => {
  const { skills } = useSkills();
  const { attributes } = useAttributes();
  const { mutate: mutateSkills } = useUpdateSkills();
  const { mutate: mutateAttributes } = useMutateAttributes();

  const grantExperience = useCallback(
    (experience: Partial<Record<Skills, number>>) => {
      const { newSkills, newAttributes } = objectEntries(experience).reduce(
        (acc, [skillName, amount]) => {
          const skill = skills[skillName];
          const skillLevels = levelUpRecursively(skill.level, skill.exp + amount);
          const connectedAttribute = getAttributeBySkill(skillName);
          const attribute = attributes[connectedAttribute];
          const attLevels = levelUpRecursively(
            attribute.level,
            attribute.exp + Math.floor(amount / 5),
          );

          return {
            newSkills: { ...acc.newSkills, [skillName]: skillLevels },
            newAttributes: { ...acc.newAttributes, [connectedAttribute]: attLevels },
          };
        },
        {} as { newSkills: Partial<SkillStore>; newAttributes: Partial<AttributeStore> },
      );

      mutateSkills(newSkills);
      mutateAttributes(newAttributes);
    },
    [skills, mutateSkills, attributes, mutateAttributes],
  );

  return grantExperience;
};
