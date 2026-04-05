import styled from "styled-components";
import { useState } from "preact/hooks";
import type { HitTarget } from "../../combat/util";
import type { CreatureInstance } from "../../npc/creature-definitions";
import { objectEntries } from "../../util";
import { useHandleAttack } from "../../combat/hooks";
import { useAcuity } from "../../data/acuity/hooks";
import { getEffectiveHitChance, getHealthLost, getSprintDistance } from "../../combat/util";
import { useHandleEquipment } from "../../data/equipment/hooks";
import { useHandleDiscoveries } from "../../data/discoveries/hooks";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import { useHandleEncounter, useUpdateEnemies } from "../../data/encounters/hooks";
import { useSkills } from "../../data/skills/hooks";
import TooltipWrapper from "../../style/TooltipWrapper";

const TargetButton = styled.button<{ $selected: boolean }>`
  background-color: ${(props) => (props.$selected ? "#1d4ed8" : "")};
  color: ${(props) => (props.$selected ? "#fff" : "")};
`;

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
`;

const getShootInterval = (rangedLevel = 0, combatAcuity = 0) =>
  Math.max(5, 10 * (1 - rangedLevel / 200) * (1 - combatAcuity / 200));

interface Props {
  enemy: CreatureInstance;
}

const RangedCombat = ({ enemy }: Props) => {
  const [selectedTarget, setSelectedTarget] = useState<HitTarget>("body");
  const { handleAttack, getHitChance } = useHandleAttack();
  const { getWeaponStats } = useHandleEquipment();
  const { updateDiscovery } = useHandleDiscoveries();
  const { updatePlayerStatus } = useHandlePlayerStatus();
  const { encounter } = useHandleEncounter();
  const updateEnemies = useUpdateEnemies();
  const { skills } = useSkills();
  const acuity = useAcuity();

  const bowStats = getWeaponStats("bow");
  const bowRange = bowStats?.class === "projectile" ? (bowStats.tier?.range ?? 0) : 0;
  const noWeapon = !bowRange;
  const outOfRange = enemy.health > 0 && enemy.distance > bowRange;
  const hitChance =
    Math.floor(getEffectiveHitChance(getHitChance(enemy), selectedTarget) * 1000) / 10;

  const handleShoot = () => {
    const result = handleAttack(enemy, selectedTarget, enemy.discovered);
    updatePlayerStatus({ energy: -2 });
    const healthLost = result !== "failure" ? result.healthLost : 0;

    if (healthLost === 0) {
      updateDiscovery("failed_hunt");
    }

    const shootInterval = getShootInterval(skills.ranged.level, acuity.combat.level);

    const updatedEnemies = objectEntries(encounter.enemies).map(([id, e]) => {
      const newHealth = id === enemy.id ? e.health - healthLost : e.health;
      const isAlive = newHealth > 0;
      const wounded = { ...e, health: newHealth };

      if (e.hostile && isAlive) {
        const closingDistance = getSprintDistance(wounded, shootInterval);
        const newDistance = Math.max(0, e.distance - closingDistance);
        if (newDistance <= 0) {
          const lungeDamage = getHealthLost(0, e.attributes.strength / 5);
          updatePlayerStatus({ health: -lungeDamage });
          console.info(`${e.name} lunges at you for ${lungeDamage} damage!`);
          return { id, health: newHealth, distance: 5, discovered: true };
        }
        return { id, health: newHealth, distance: newDistance, discovered: true };
      }

      const fleeDistance = isAlive ? getSprintDistance(wounded, shootInterval) : 0;
      const newDistance = e.distance + fleeDistance;
      const outOfBowRange = newDistance > bowRange;
      const bonusFlee = outOfBowRange && isAlive ? getSprintDistance(wounded, 30) : 0;

      return { id, health: newHealth, distance: newDistance + bonusFlee, discovered: true };
    });

    updateEnemies(updatedEnemies);
  };

  return (
    <>
      <div style={{ marginTop: "0.5rem" }}>
        {(["head", "body", "legs"] as HitTarget[]).map((t) => (
          <TargetButton
            key={t}
            $selected={selectedTarget === t}
            onClick={() => setSelectedTarget(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </TargetButton>
        ))}
      </div>
      {!outOfRange && (
        <ActionRow>
          <TooltipWrapper
            description={noWeapon ? "You need a weapon" : `Attack roll: ${hitChance}%`}
            inline
          >
            <button disabled={noWeapon} onClick={handleShoot}>
              Shoot
            </button>
          </TooltipWrapper>
        </ActionRow>
      )}
    </>
  );
};

export default RangedCombat;
