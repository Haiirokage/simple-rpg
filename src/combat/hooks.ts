import { useCallback } from "preact/hooks";
import { useAttributes } from "../data/attributes/hooks";
import { useEncounter } from "../data/encounters/hooks";
import { useSkills } from "../data/skills/hooks";
import { CREATURES } from "../npc/creature-definitions";
import { calculateHit, getHealthLost, getHitSeverityByTarget } from "./util";

/**
 * Hook that returns a function to handle ranged attacks.
 * Calculates hit chance, damage, and updates NPC health.
 */
export const useHandleAttack = () => {
  const { data: encounter } = useEncounter();
  const { attributes } = useAttributes();
  const { skills } = useSkills();

  return useCallback(
    (targetNpcId: string, target: "head" | "body" | "legs") => {
      const npc = encounter.npcs[targetNpcId];
      if (!npc) return "failure";

      const creature = CREATURES[npc.type as keyof typeof CREATURES];
      if (!creature) return "failure";

      const hitQuality = calculateHit(
        attributes.dexterity.level,
        skills.ranged?.level || 0,
        npc.distance,
        creature.attributes.dexterity,
      );
      const hitSeverity = getHitSeverityByTarget(target, hitQuality);

      const targetBaseDamage = target === "head" ? 25 : target === "body" ? 15 : 5;
      const damageMultiplier =
        hitSeverity === "critical"
          ? 1 * targetBaseDamage
          : hitSeverity === "severe"
            ? 0.5 * targetBaseDamage
            : 0;

      const creatureDefinition = CREATURES[npc.type];

      const healthLost = getHealthLost(
        creatureDefinition.targets[target].armor_rating,
        damageMultiplier,
      );

      return { healthLost, hitSeverity };
    },
    [encounter, attributes, skills],
  );
};
