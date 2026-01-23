import styled from "styled-components";
import type { CreatureIntance } from "../../npc/creature-definitions";
import { objectEntries } from "../../util";
import { useState } from "preact/hooks";
import { useSetEncounter, useUpdateEnemies } from "../../data/encounters/hooks";
import { useHandleAttack } from "../../combat/hooks";

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
  const [selectedEnemy, setSelectedEnemy] = useState<string>();

  const enemy = selectedEnemy && enemies[selectedEnemy];
  const enemyEntries = objectEntries(enemies);

  const enemyTurn = () => {
    const newEnemyStates = enemyEntries.map(([id, enemy]) => {
      return { id, distance: enemy.distance + 10 };
    });
    return newEnemyStates;
  };
  return (
    <>
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
      <button onClick={() => setEncounter("exit")}>leave</button>
      {enemy && (
        <button
          onClick={() => {
            const newEnemyStates = enemyTurn();
            const x = handleAttack(enemy, "body", true);
            console.log(x, enemy);
            const damagedEnemies =
              x !== "failure"
                ? newEnemyStates.map((e) => {
                    if (e.id === selectedEnemy) {
                      return { ...e, health: enemy.health - x.healthLost };
                    }
                    return e;
                  })
                : newEnemyStates;

            updateEnemies(damagedEnemies);
          }}
        >
          shoot
        </button>
      )}
    </>
  );
};

export default CombatView;
