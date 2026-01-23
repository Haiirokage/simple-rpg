import { useCallback } from "preact/hooks";
import { useAttributes } from "../data/attributes/hooks";
import { useGrantSkillExperience, useHandleSkills } from "../data/skills/hooks";
import { getTarget } from "../npc/creature-definitions";
import { calculateHit, getHealthLost, getHitSeverityByTarget } from "./util";
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

      const hitQuality = calculateHit(
        attributes.dexterity.level,
        skills.ranged?.level || 0,
        npc.distance,
        creatureDefinition.attributes.dexterity,
        bowRange,
        discovered,
      );
      const hitSeverity = getHitSeverityByTarget(target, hitQuality);

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
        const distanceFactor = Math.pow(npc.distance - bowRange / 5, 3 / 2);
        const discFactor = discovered ? 2 : 1;
        const skillExperience = {
          ranged: ((healthLost / 100) * distanceFactor * discFactor) / 5,
        };

        console.info("Granting ranged experience:", skillExperience.ranged);
        grantSkillExperience(skillExperience);
      }

      return { healthLost, hitSeverity };
    },
    [attributes, skills, grantSkillExperience, getEquipmentBonus],
  );
};
