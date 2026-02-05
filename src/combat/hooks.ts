import { useCallback } from "preact/hooks";
import { useAcuity } from "../data/acuity/hooks";
import { useAttributes } from "../data/attributes/hooks";
import { useGrantSkillExperience, useHandleSkills } from "../data/skills/hooks";
import type { CreatureIntance } from "../npc/creature-definitions";
import {
  calculateHitChance,
  calculateHitSeverity,
  getDifficultyMultiplier,
  getEffectiveDex,
  getHealthLost,
  type HitSeverity,
} from "./util";
import { useHandleEquipment } from "../data/equipment/hooks";

const TARGET_DAMAGE: Record<string, number> = { head: 25, body: 15, legs: 5 };
const SEVERITY_MULT: Record<HitSeverity, number> = { critical: 1, severe: 0.5, miss: 0 };

/**
 * Hook that returns a function to handle ranged attacks.
 * Calculates hit chance, damage, and updates NPC health.
 */
export const useHandleAttack = () => {
  const { getEquipmentBonus } = useHandleEquipment();
  const { attributes } = useAttributes();
  const { skills } = useHandleSkills();
  const grantSkillExperience = useGrantSkillExperience();
  const acuity = useAcuity();

  return useCallback(
    (creature: CreatureIntance, target: "head" | "body" | "legs", discovered = false) => {
      if (!creature) return "failure";

      const bowRange = getEquipmentBonus("bow", "range");
      console.log("range", bowRange);

      const creatureDex = getEffectiveDex(creature);
      const hitChance = calculateHitChance(
        attributes.dexterity.level,
        skills.ranged.level,
        creature.distance,
        creatureDex,
        bowRange,
        discovered,
        acuity.combat.level,
      );
      const hitSeverity = calculateHitSeverity(target, hitChance);

      const damageMultiplier = TARGET_DAMAGE[target] * SEVERITY_MULT[hitSeverity];

      const healthLost = getHealthLost(creature.targets[target].armor_rating, damageMultiplier);

      const distanceFactor = Math.max(0.1, (creature.distance - 20) / 100);
      const discFactor = discovered ? 1 + creatureDex / 10 : 1;
      const difficultyMultiplier = getDifficultyMultiplier(hitChance);
      const severityBonus = hitSeverity === "critical" ? 2 : 1;
      const skillExperience = {
        ranged:
          Math.max(healthLost, 1) *
          distanceFactor *
          discFactor *
          difficultyMultiplier *
          severityBonus,
      };

      console.info(
        "Granting ranged experience:",
        skillExperience.ranged,
        distanceFactor * discFactor * difficultyMultiplier * severityBonus,
        {
          healthLost,
          distanceFactor,
          discFactor,
          difficultyMultiplier,
          severityBonus,
        },
      );
      grantSkillExperience(skillExperience);

      return { healthLost, hitSeverity };
    },
    [attributes, skills, acuity, grantSkillExperience, getEquipmentBonus],
  );
};
