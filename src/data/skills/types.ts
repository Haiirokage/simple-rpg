export type Skills = "hunter";

export type Skill = {
  level: number;
  exp: number;
};

/**
 * Hunter skill encompasses tracking, animal lore, and skinning.
 * Everything involved with extracting resources from wildlife.
 */

export type SkillStore = Record<Skills, Skill>;
