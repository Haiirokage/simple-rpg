import styled from "styled-components";
import type { CreatureIntance } from "../../npc/creature-definitions";
import { objectEntries } from "../../util";
import { useState } from "preact/hooks";
import { useSetEncounter, useUpdateEnemies, useEncounter } from "../../data/encounters/hooks";
import { useHandleAttack } from "../../combat/hooks";
import { useEquipment } from "../../data/equipment/hooks";
import { useMutateDiscoveries } from "../../data/discoveries/hooks";
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

const statusConfig = (healthRatio: number) => {
  if (healthRatio > 0.7) {
    return {
      label: "Healthy",
      borderColor: "#10b981",
      icon: "⚔️",
    };
  } else if (healthRatio > 0.3) {
    return {
      label: "Wounded",
      borderColor: "#f59e0b",
      icon: "🩹",
    };
  }
  return {
    label: "Critically Wounded",
    borderColor: "#ef4444",
    icon: "💀",
  };
};

interface Props {
  enemies: Record<string, CreatureIntance>;
}

const CombatView = ({ enemies }: Props) => {
  const updateEnemies = useUpdateEnemies();
  const handleAttack = useHandleAttack();
  const setEncounter = useSetEncounter();
  const { data: encounter } = useEncounter();
  const equipment = useEquipment();
  const mutateDiscoveries = useMutateDiscoveries();
  const [selectedEnemy, setSelectedEnemy] = useState<string>();
  const noWeapon = !equipment.tools.bow;

  const combatContext = encounter.combatContext;
  const enemy = selectedEnemy && enemies[selectedEnemy];
  const enemyEntries = objectEntries(enemies);
  const allDead = enemyEntries.every(([, e]) => e.health <= 0);

  const handleShoot = () => {
    if (!enemy) return;
    const result = handleAttack(enemy, "body", !!enemy.discovered);
    const healthLost = result !== "failure" ? result.healthLost : 0;

    if (healthLost === 0) {
      mutateDiscoveries({ failed_hunt: 1 });
    }

    const updatedEnemies = enemyEntries.map(([id, e]) => {
      if (id === selectedEnemy) {
        return { id, health: e.health - healthLost, discovered: true };
      }
      return { id, discovered: true };
    });

    updateEnemies(updatedEnemies);
  };

  if (allDead) {
    return <CombatResolution enemies={enemies} combatContext={combatContext} />;
  }

  return (
    <>
      {combatContext?.flavorText && <p>{combatContext.flavorText}</p>}
      {enemyEntries.map(([id, enemy]) => {
        const config = statusConfig(enemy.health / enemy.maxHealth);
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
      <button onClick={() => setEncounter("exit", 10, combatContext?.exitMessage)}>Flee</button>
      {enemy && (
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
