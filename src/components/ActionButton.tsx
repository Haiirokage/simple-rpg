import type { ActionCost } from "./actions/types";
import { formatResourceCost, getAffordability } from "../data/resources/util";
import { useHandlePlayerStatus } from "../data/playerStatus/hooks";
import { useAdvanceTime } from "../data/time/hooks";
import { useHandleResources, useResources } from "../data/resources/hooks";
import { CostIndicator, EnergyCircle, TimeCostIndicator } from "./CostDisplay";

interface ActionButtonProps {
  name: string;
  cost: ActionCost;
  disabled?: boolean;
  onClick: () => void;
}

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
      {timeCost > 0 && <TimeCostIndicator timeCost={timeCost} />}
    </button>
  );
};

export default ActionButton;
