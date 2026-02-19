export type Skills =
  | "hunter"
  | "ranged"
  | "crafting"
  | "stealth"
  | "meditation"
  | "lore"
  | "mining";

export type Skill = {
  /** Current level 1-100 */
  level: number;
  exp: number;
};

/**
 * Hunter skill encompasses tracking, animal lore, and skinning.
 * Everything involved with extracting resources from wildlife.
 */

/**
 * Ranged skill encompasses proficiency with bows, crossbows, and thrown weapons.
 * It affects accuracy and handling of ranged weapons.
 */

export type SkillStore = Record<Skills, Skill>;
