import type { ActionDefinition } from "./actions/definitions";
import { formatResourceCost } from "../data/resources/util";
import styled from "styled-components";

interface ActionButtonProps {
  action: Omit<ActionDefinition, "id">;
  energyModifier?: number;
  disabled?: boolean;
  onClick: () => void;
}

const CostIndicator = styled.div`
  font-size: 0.8em;
  margin: 0 0.25rem;
  display: inline-flex;
  gap: 0.3rem;
`;

const EnergyCircle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4169e1;
`;

const ClockFace = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid #666;
  position: relative;
`;

const ClockHand = styled.div<{ angle: number }>`
  width: 1px;
  background-color: #666;
  position: absolute;
  transform: translateX(-50%) rotate(${(props) => props.angle}deg);

  &:first-of-type {
    height: 5px;
    top: 2px;
    left: 8px;
  }

  &:last-of-type {
    height: 3px;
    top: 4px;
    left: 5px;
  }
`;

const ActionButton = ({
  action,
  energyModifier = 0,
  disabled = false,
  onClick,
}: ActionButtonProps) => {
  const resourceCostStr = formatResourceCost(action.resourceCost);

  return (
    <button disabled={disabled} onClick={onClick}>
      <div>
        {action.name}
        {resourceCostStr && <span> ({resourceCostStr})</span>}
      </div>
      <CostIndicator>
        <span>{action.energyCost + energyModifier}</span>
        <EnergyCircle />
      </CostIndicator>
      <CostIndicator>
        <span>{action.timeCost}</span>
        <ClockFace>
          <ClockHand angle={45} />
          <ClockHand angle={-45} />
        </ClockFace>
      </CostIndicator>
    </button>
  );
};

export default ActionButton;
