import styled from "styled-components";
import type { HitTarget } from "../../combat/util";
import type { CreatureInstance } from "../../npc/creature-definitions";
import { objectEntries, usePrevious } from "../../util";
import { useState } from "preact/hooks";
import DistanceBar from "./DistanceBar";
import {
  useSetEncounter,
  useUpdateEnemies,
  useHandleEncounter,
  useHandleSkillCheck,
} from "../../data/encounters/hooks";
import { useHandleAttack } from "../../combat/hooks";
import { useAcuity, useGrantAcuityExp } from "../../data/acuity/hooks";
import { getEffectiveHitChance, getHealthLost, getSprintDistance } from "../../combat/util";
import { useHandleExploration } from "../../data/exploration/hooks";
import { useHandleEquipment } from "../../data/equipment/hooks";
import { useAttributes } from "../../data/attributes/hooks";
import { useSkills } from "../../data/skills/hooks";
import { useHandleDiscoveries } from "../../data/discoveries/hooks";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import TooltipWrapper from "../../style/TooltipWrapper";
import CombatResolution from "./CombatResolution";
import EnemyCard from "./EnemyCard";

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
  enemies: Record<string, CreatureInstance>;
}

const CombatView = ({ enemies }: Props) => {
  const updateEnemies = useUpdateEnemies();
  const { handleAttack, getHitChance } = useHandleAttack();
  const setEncounter = useSetEncounter();
  const { encounter, mutateEncounter } = useHandleEncounter();
  const { getWeaponStats } = useHandleEquipment();
  const { skills } = useSkills();
  const { exploration } = useHandleExploration();
  const { updateDiscovery } = useHandleDiscoveries();
  const handleSkillCheck = useHandleSkillCheck(exploration.biome);
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const { attributes } = useAttributes();
  const [selectedEnemy, setSelectedEnemy] = useState(Object.keys(enemies)[0]);
  const [selectedTarget, setSelectedTarget] = useState<HitTarget>("body");
  const grantAcuityExp = useGrantAcuityExp();
  const acuity = useAcuity();

  const bowStats = getWeaponStats("bow");
  const bowRange = bowStats?.class === "projectile" ? (bowStats.tier?.range ?? 0) : 0;
  const noWeapon = !bowRange;
  const combatContext = encounter.combatContext;
  const enemy = selectedEnemy ? enemies[selectedEnemy] : undefined;
  const enemyEntries = objectEntries(enemies);
  const allDead = enemyEntries.every(([, e]) => e.health <= 0);
  const aware = enemyEntries.some(([, e]) => e.discovered);
  const anyHostile = enemyEntries.some(([, e]) => e.hostile);
  const outOfRange = enemy && enemy.health > 0 && enemy.distance > bowRange;

  const prevAllDead = usePrevious(allDead);
  if (allDead && !prevAllDead) {
    const acuityExp = anyHostile ? 50 : 10;
    grantAcuityExp("combat", acuityExp);
    console.info(`Combat acuity +${acuityExp}`);
  }

  const handleShoot = () => {
    if (!enemy) return;
    const result = handleAttack(enemy, selectedTarget, enemy.discovered);
    updatePlayerStatus({ energy: -2 });
    const healthLost = result !== "failure" ? result.healthLost : 0;

    if (healthLost === 0) {
      updateDiscovery("failed_hunt");
    }

    const shootInterval = getShootInterval(skills.ranged.level, acuity.combat.level);

    const updatedEnemies = enemyEntries.map(([id, e]) => {
      const newHealth = id === selectedEnemy ? e.health - healthLost : e.health;
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

  const handleTrack = (target: CreatureInstance) => {
    const dc = Math.floor(Math.sqrt(target.distance / 8));
    const closedDistance = target.distance - 100;
    const playerSpeed = Math.cbrt(attributes.dexterity.level) / 2;
    const trackingSeconds = closedDistance / playerSpeed;
    const trackingMinutes = Math.round(trackingSeconds / 60);
    const result = handleSkillCheck({ skill: ["hunter"], knowledge: true, dc });

    if (result === "success") {
      updateEnemies([{ id: target.id, distance: 100 }]);
      mutateEncounter({ timePassed: encounter.timePassed + trackingMinutes });
      updatePlayerStatus({ energy: -Math.ceil((trackingMinutes * 5) / 60) });
    } else {
      setEncounter("exit", trackingMinutes + 30, combatContext?.exitMessage);
    }
  };

  const sneakDistance = 20;
  const getSneakDC = (targetDistance: number) => Math.round(19 - targetDistance / 9);

  const handleSneak = (target: CreatureInstance) => {
    const targetDistance = target.distance - sneakDistance;
    const dc = getSneakDC(targetDistance);
    const result = handleSkillCheck({ skill: ["stealth"], knowledge: true, dc });

    if (result === "success") {
      updateEnemies([{ id: target.id, distance: targetDistance }]);
      mutateEncounter({ timePassed: encounter.timePassed + 2 });
    } else {
      updateEnemies([{ id: target.id, discovered: true }]);
    }
  };

  if (playerStatus.health <= 0) {
    return (
      <>
        <p>You have been slain.</p>
        <button onClick={() => setEncounter("exit", 0)}>Accept your fate</button>
      </>
    );
  }

  if (allDead) {
    return <CombatResolution enemies={enemies} combatContext={combatContext} />;
  }

  const hitChance = enemy
    ? Math.floor(getEffectiveHitChance(getHitChance(enemy), selectedTarget) * 1000) / 10
    : undefined;

  return (
    <>
      {combatContext?.flavorText && (
        <p>
          {combatContext.flavorText}
          {!aware && " It hasn't noticed you yet."}
        </p>
      )}
      <DistanceBar enemies={enemies} selectedEnemy={selectedEnemy} />
      <div>
        {enemyEntries.map(([id, e]) => (
          <EnemyCard
            key={id}
            id={id}
            enemy={e}
            selected={id === selectedEnemy}
            onSelect={() => setSelectedEnemy(id)}
          />
        ))}
      </div>
      {enemy && (
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
      )}
      <ActionRow>
        {!aware && enemy && (
          <TooltipWrapper
            description={`Sneak to ${enemy.distance - sneakDistance}m (DC ${getSneakDC(enemy.distance - sneakDistance)})`}
            inline
          >
            <button onClick={() => handleSneak(enemy)}>Sneak closer</button>
          </TooltipWrapper>
        )}
        {outOfRange && aware && enemy && !anyHostile && (
          <button onClick={() => handleTrack(enemy)}>Track</button>
        )}
        {!outOfRange && enemy && (
          <TooltipWrapper
            description={noWeapon ? "You need a weapon" : `Attack roll: ${hitChance}%`}
            inline
          >
            <button disabled={noWeapon} onClick={handleShoot}>
              Shoot
            </button>
          </TooltipWrapper>
        )}
      </ActionRow>
      <ActionRow>
        {!anyHostile && (
          <button onClick={() => setEncounter("exit", 10, combatContext?.exitMessage)}>
            {outOfRange ? "Give up" : "Flee"}
          </button>
        )}
      </ActionRow>
    </>
  );
};

export default CombatView;
