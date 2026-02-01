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
} from "./util";
import { useHandleEquipment } from "../data/equipment/hooks";

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

      const hitChance = calculateHitChance(
        attributes.dexterity.level,
        skills.ranged.level,
        creature.distance,
        getEffectiveDex(creature),
        bowRange,
        discovered,
        acuity.combat.level,
      );
      const hitSeverity = calculateHitSeverity(target, hitChance);

      const targetBaseDamage = target === "head" ? 25 : target === "body" ? 15 : 5;
      const damageMultiplier =
        hitSeverity === "critical"
          ? 1 * targetBaseDamage
          : hitSeverity === "severe"
            ? 0.5 * targetBaseDamage
            : 0;

      const healthLost = getHealthLost(creature.targets[target].armor_rating, damageMultiplier);

      if (healthLost > 0) {
        const distanceFactor = Math.max(0.1, (creature.distance - 20) / 100);
        const discFactor = discovered ? 2 : 1;
        const difficultyMultiplier = getDifficultyMultiplier(hitChance);
        const severityBonus = hitSeverity === "critical" ? 2 : 1;
        const skillExperience = {
          ranged: healthLost * distanceFactor * discFactor * difficultyMultiplier * severityBonus,
        };

        console.info("Granting ranged experience:", skillExperience.ranged, {
          hitChance,
          difficultyMultiplier,
          distanceFactor,
          severityBonus,
        });
        grantSkillExperience(skillExperience);
      }

      return { healthLost, hitSeverity };
    },
    [attributes, skills, acuity, grantSkillExperience, getEquipmentBonus],
  );
};
