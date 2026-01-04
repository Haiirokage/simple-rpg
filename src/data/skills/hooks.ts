import { useDataQuery, useUpdateData } from "../util";
import type { Skills, SkillStore } from "./types";
import { useCallback } from "preact/hooks";
import { objectEntries } from "../../util";
import { levelUpRecursively } from "../leveling-util";

const defaultSkillStore: SkillStore = {
  hunter: {
    level: 10,
    exp: 0,
  },
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

export const useGrantSkillExperience = () => {
  const { skills } = useSkills();
  const { mutate: mutateSkills } = useUpdateSkills();

  const grantExperience = useCallback(
    (experience: Partial<Record<Skills, number>>) => {
      const updated = objectEntries(experience).reduce((acc, [skillName, amount]) => {
        const skill = skills[skillName];
        const { level, exp } = levelUpRecursively(skill.level, skill.exp + amount);
        return {
          ...acc,
          [skillName]: { level, exp },
        };
      }, {} as Partial<SkillStore>);

      mutateSkills(updated as SkillStore);
    },
    [skills, mutateSkills],
  );

  return grantExperience;
};
