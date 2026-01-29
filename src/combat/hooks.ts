import { useCallback } from "preact/hooks";
import { useAttributes } from "../data/attributes/hooks";
import { useGrantSkillExperience, useHandleSkills } from "../data/skills/hooks";
import { getTarget } from "../npc/creature-definitions";
import {
  calculateHitChance,
  calculateHitSeverity,
  getDifficultyMultiplier,
  getHealthLost,
} from "./util";
import type { NPC } from "../data/encounters/types";
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

  return useCallback(
    (targetNpc: NPC, target: "head" | "body" | "legs", discovered = false) => {
      const npc = targetNpc;
      if (!npc) return "failure";

      const creatureDefinition = getTarget(npc.type);
      if (!creatureDefinition) return "failure";

      const bowRange = getEquipmentBonus("bow", "range");
      console.log("range", bowRange);

      const hitChance = calculateHitChance(
        attributes.dexterity.level,
        skills.ranged?.level || 0,
        npc.distance,
        creatureDefinition.attributes.dexterity,
        bowRange,
        discovered,
      );
      const hitSeverity = calculateHitSeverity(target, hitChance);

      const targetBaseDamage = target === "head" ? 25 : target === "body" ? 15 : 5;
      const damageMultiplier =
        hitSeverity === "critical"
          ? 1 * targetBaseDamage
          : hitSeverity === "severe"
            ? 0.5 * targetBaseDamage
            : 0;

      const healthLost = getHealthLost(
        creatureDefinition.targets[target].armor_rating,
        damageMultiplier,
      );

      if (healthLost > 0) {
        const distanceFactor = Math.max(0.1, (npc.distance - 20) / 100);
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
    [attributes, skills, grantSkillExperience, getEquipmentBonus],
  );
};
