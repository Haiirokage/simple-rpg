import type { ComponentChildren } from "preact";
import type { ActionCost } from "./actions/types";
import { useHandleExploration } from "../data/exploration/hooks";
import { useHandlePlayerStatus } from "../data/playerStatus/hooks";
import { useAdvanceTime } from "../data/time/hooks";
import { objectEntries } from "../util";
import CurrencyDisplay from "./CurrencyDisplay";
import TooltipWrapper from "../style/TooltipWrapper";
import { CostIndicator, EnergyCircle, TimeCostIndicator } from "./CostDisplay";

interface ExplorationCostButtonProps {
  children: ComponentChildren;
  cost: ActionCost;
  disabled?: boolean;
  onClick: () => void;
}

const ExplorationCostButton = ({
  children,
  cost,
  disabled = false,
  onClick,
}: ExplorationCostButtonProps) => {
  const { exploration, mutateExploration } = useHandleExploration();
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const advanceTime = useAdvanceTime();

  const inventory = exploration.inventory;
  const energyCost = cost.energy ?? 0;
  const timeCost = cost.time ?? 0;
  const resourceCost = cost.resources;

  const canAffordEnergy = energyCost === 0 || playerStatus.energy >= energyCost;
  const canAffordResources =
    !resourceCost ||
    objectEntries(resourceCost).every(([key, amount]) => (inventory[key] ?? 0) >= amount);

  const handleClick = () => {
    if (resourceCost) {
      const newInventory = objectEntries(resourceCost).reduce(
        (acc, [key, amount]) => ({ ...acc, [key]: (acc[key] ?? 0) - amount }),
        { ...inventory },
      );
      mutateExploration({ inventory: newInventory });
    }
    if (energyCost > 0) updatePlayerStatus({ energy: -energyCost });
    if (timeCost > 0) advanceTime(timeCost);
    onClick();
  };

  const coinCost = resourceCost?.coin;

  const entries = resourceCost ? objectEntries(resourceCost) : [];
  const nonCoinCosts = entries
    .filter(([key]) => key !== "coin")
    .map(([key, amount]) => `${amount} ${key}`);
  const tooltip = nonCoinCosts.join(", ");

  return (
    <TooltipWrapper description={tooltip || undefined} inline>
      <button disabled={disabled || !canAffordEnergy || !canAffordResources} onClick={handleClick}>
        <div>{children}</div>
        {!!coinCost && (
          <span>
            {" "}
            (<CurrencyDisplay amount={coinCost} />)
          </span>
        )}
        {energyCost > 0 && (
          <CostIndicator>
            <span>{energyCost}</span>
            <EnergyCircle />
          </CostIndicator>
        )}
        {timeCost > 0 && <TimeCostIndicator timeCost={timeCost} />}
      </button>
    </TooltipWrapper>
  );
};

export default ExplorationCostButton;
