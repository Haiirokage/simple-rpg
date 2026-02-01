import styled from "styled-components";
import type { CreatureIntance } from "../../npc/creature-definitions";
import { objectEntries } from "../../util";
import { useState } from "preact/hooks";
import {
  useSetEncounter,
  useUpdateEnemies,
  useHandleEncounter,
  useHandleSkillCheck,
} from "../../data/encounters/hooks";
import { useHandleAttack } from "../../combat/hooks";
import { getSprintDistance, getWoundStatus, type WoundStatus } from "../../combat/util";
import { useHandleEquipment } from "../../data/equipment/hooks";
import { useAttributes } from "../../data/attributes/hooks";
import { useSkills } from "../../data/skills/hooks";
import { useMutateDiscoveries } from "../../data/discoveries/hooks";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import TooltipWrapper from "../../style/TooltipWrapper";
import CombatResolution from "./CombatResolution";

const EnemyCard = styled.div<{ borderColor: string; selected?: boolean }>`
  display: inline-block;
  border: 2px solid ${(props) => props.borderColor};
  border-radius: 8px;
  padding: 12px;
  margin-right: 6px;
  width: 150px;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
  background-color: ${(props) => (props.selected ? "#eff6ff" : "white")};
  box-shadow: ${(props) =>
    props.selected
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      : "none"};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    color: #333;
  }
`;

const Icon = styled.span`
  font-size: 18px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const STATUS_CONFIG: Record<WoundStatus, { label: string; borderColor: string; icon: string }> = {
  healthy: { label: "Healthy", borderColor: "#10b981", icon: "⚔️" },
  wounded: { label: "Wounded", borderColor: "#f59e0b", icon: "🩹" },
  critical: { label: "Critically Wounded", borderColor: "#ef4444", icon: "💀" },
};

const getShootInterval = (rangedLevel: number) => Math.max(5, 10 * (1 - rangedLevel / 200));

interface Props {
  enemies: Record<string, CreatureIntance>;
}

const CombatView = ({ enemies }: Props) => {
  const updateEnemies = useUpdateEnemies();
  const handleAttack = useHandleAttack();
  const setEncounter = useSetEncounter();
  const { encounter, mutateEncounter } = useHandleEncounter();
  const { getEquipmentBonus } = useHandleEquipment();
  const { skills } = useSkills();
  const mutateDiscoveries = useMutateDiscoveries();
  const handleSkillCheck = useHandleSkillCheck();
  const { updatePlayerStatus } = useHandlePlayerStatus();
  const { attributes } = useAttributes();
  const [selectedEnemy, setSelectedEnemy] = useState(Object.keys(enemies)[0]);

  const noWeapon = !getEquipmentBonus("bow", "range");
  const bowRange = getEquipmentBonus("bow", "range");
  const combatContext = encounter.combatContext;
  const enemy = selectedEnemy && enemies[selectedEnemy];
  const enemyEntries = objectEntries(enemies);
  const allDead = enemyEntries.every(([, e]) => e.health <= 0);
  const aware = enemyEntries.some(([, e]) => e.discovered);
  const outOfRange = enemy && enemy.health > 0 && enemy.distance > bowRange;

  const handleShoot = () => {
    if (!enemy) return;
    const result = handleAttack(enemy, "body", !!enemy.discovered);
    const healthLost = result !== "failure" ? result.healthLost : 0;

    if (healthLost === 0) {
      mutateDiscoveries({ failed_hunt: 1 });
    }

    const shootInterval = getShootInterval(skills.ranged?.level || 0);

    const updatedEnemies = enemyEntries.map(([id, e]) => {
      const newHealth = id === selectedEnemy ? e.health - healthLost : e.health;
      const isAlive = newHealth > 0;
      const wounded = { ...e, health: newHealth };
      const fleeDistance = isAlive && !e.hostile ? getSprintDistance(wounded, shootInterval) : 0;
      const newDistance = e.distance + fleeDistance;
      const outOfBowRange = newDistance > bowRange;
      const bonusFlee = outOfBowRange && isAlive && !e.hostile ? getSprintDistance(wounded, 30) : 0;

      return {
        id,
        health: newHealth,
        distance: newDistance + bonusFlee,
        discovered: true,
      };
    });

    updateEnemies(updatedEnemies);
  };

  const handleTrack = (target: CreatureIntance) => {
    const dc = Math.floor(Math.sqrt(target.distance / 4));
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

  if (allDead) {
    return <CombatResolution enemies={enemies} combatContext={combatContext} />;
  }

  return (
    <>
      {combatContext?.flavorText && (
        <p>
          {combatContext.flavorText}
          {!aware && " It hasn't noticed you yet."}
        </p>
      )}
      {enemyEntries.map(([id, enemy]) => {
        const config = STATUS_CONFIG[getWoundStatus(enemy)];
        return (
          <EnemyCard
            borderColor={config.borderColor}
            selected={id === selectedEnemy}
            onClick={() => setSelectedEnemy(id)}
          >
            <Header>
              <h2>{id}</h2>
              <Icon>{config.icon}</Icon>
            </Header>

            <StatusRow>
              <StatusLabel>Distance:</StatusLabel>
              <span>{enemy.distance} meters</span>
            </StatusRow>
          </EnemyCard>
        );
      })}
      <button onClick={() => setEncounter("exit", 10, combatContext?.exitMessage)}>
        {outOfRange ? "Give up" : "Flee"}
      </button>
      {outOfRange && aware && enemy && <button onClick={() => handleTrack(enemy)}>Track</button>}
      {!outOfRange && enemy && (
        <TooltipWrapper description={noWeapon ? "You need a weapon" : "Attack roll"} inline>
          <button disabled={noWeapon} onClick={handleShoot}>
            Shoot
          </button>
        </TooltipWrapper>
      )}
    </>
  );
};

export default CombatView;
