import type { ActionCost } from "./actions/types";
import { formatResourceCost, getAffordability } from "../data/resources/util";
import { useHandlePlayerStatus } from "../data/playerStatus/hooks";
import { useAdvanceTime } from "../data/time/hooks";
import { useHandleResources, useResources } from "../data/resources/hooks";
import styled from "styled-components";

interface ActionButtonProps {
  name: string;
  cost: ActionCost;
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

const ActionButton = ({ name, cost, disabled = false, onClick }: ActionButtonProps) => {
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const { resources } = useResources();
  const { addResources } = useHandleResources();
  const advanceTime = useAdvanceTime();

  const energyCost = cost?.energy ?? 0;
  const timeCost = cost?.time ?? 0;
  const resourceCost = cost?.resources;
  const notEnoughEnergy = energyCost > 0 && playerStatus.energy < energyCost;
  const { canAfford } = getAffordability(resourceCost, resources);
  const resourceCostStr = formatResourceCost(resourceCost);

  const handleClick = () => {
    if (energyCost > 0) {
      updatePlayerStatus({ energy: -energyCost });
    }
    if (timeCost > 0) {
      advanceTime(timeCost);
    }
    if (resourceCost) {
      addResources(Object.fromEntries(Object.entries(resourceCost).map(([k, v]) => [k, -v])));
    }
    onClick();
  };

  return (
    <button disabled={disabled || notEnoughEnergy || !canAfford} onClick={handleClick}>
      <div>
        {name}
        {resourceCostStr && <span> ({resourceCostStr})</span>}
      </div>
      {energyCost > 0 && (
        <CostIndicator>
          <span>{energyCost}</span>
          <EnergyCircle />
        </CostIndicator>
      )}
      {timeCost && (
        <CostIndicator>
          <span>{timeCost}</span>
          <ClockFace>
            <ClockHand angle={45} />
            <ClockHand angle={-45} />
          </ClockFace>
        </CostIndicator>
      )}
    </button>
  );
};

export default ActionButton;
