import styled from "styled-components";
import type { CreatureInstance } from "../../npc/creature-definitions";
import { getWoundStatus, type WoundStatus } from "../../combat/util";

const CardContainer = styled.div<{ borderColor: string; selected?: boolean }>`
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

const STATUS_CONFIG: Record<WoundStatus, { borderColor: string; icon: string }> = {
  healthy: { borderColor: "#10b981", icon: "⚔️" },
  wounded: { borderColor: "#f59e0b", icon: "🩹" },
  critical: { borderColor: "#ef4444", icon: "💀" },
};

interface Props {
  id: string;
  enemy: CreatureInstance;
  selected: boolean;
  onSelect: () => void;
}

const EnemyCard = ({ id, enemy, selected, onSelect }: Props) => {
  const config = STATUS_CONFIG[getWoundStatus(enemy)];
  return (
    <CardContainer borderColor={config.borderColor} selected={selected} onClick={onSelect}>
      <Header>
        <h2>{id}</h2>
        <Icon>{config.icon}</Icon>
      </Header>
    </CardContainer>
  );
};

export default EnemyCard;
