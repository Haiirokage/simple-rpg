import styled from "styled-components";
import { useHandleExploration } from "../../data/exploration/hooks";
import { usePlayerForce } from "../../data/attributes/hooks";
import { getInventoryWeight, getCarryCapacity, getResourceWeight } from "../../data/resources/util";
import { objectEntries } from "../../util";
import type { ResourceKeys } from "../../data/resources/types";
import { useHandleResources } from "../../data/resources/hooks";
import { Header3 } from "../../style/elements";

const WeightBar = styled.div`
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const WeightFill = styled.div<{ percent: number; overweight: boolean }>`
  height: 100%;
  width: ${(props) => Math.min(props.percent, 100)}%;
  background-color: ${(props) => (props.overweight ? "#f44336" : "#4caf50")};
  transition: width 0.2s;
`;

const WeightLabel = styled.div<{ overweight: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.overweight ? "#f44336" : "#666")};
  margin-bottom: 4px;
`;

const InventoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
`;

const InventoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const DropButton = styled.button`
  font-size: 11px;
  padding: 2px 6px;
  cursor: pointer;
`;

const explorationItems: ResourceKeys[] = ["jerky", "wood"];

const ExplorationInventory = () => {
  const { resources, addResources } = useHandleResources();
  const { exploration, mutateExploration } = useHandleExploration();
  const force = usePlayerForce();

  const carryCapacity = getCarryCapacity(force);
  const currentWeight = getInventoryWeight(exploration.inventory);
  const weightPercent = (currentWeight / carryCapacity) * 100;
  const overweight = currentWeight > carryCapacity;

  const inventoryEntries = objectEntries(exploration.inventory).filter(([, amount]) => amount > 0);

  const handleDrop = (resource: ResourceKeys, amount = 1) => {
    const current = exploration.inventory[resource] ?? 0;
    const newAmount = Math.max(0, current - amount);
    mutateExploration({
      inventory: {
        ...exploration.inventory,
        [resource]: newAmount,
      },
    });
    if (!exploration.active) {
      addResources({ [resource]: amount });
    }
  };

  return (
    <>
      <Header3>Exploration inventory</Header3>
      <WeightLabel overweight={overweight}>
        Weight: {currentWeight.toFixed(1)} / {carryCapacity.toFixed(1)}
      </WeightLabel>
      <WeightBar>
        <WeightFill percent={weightPercent} overweight={overweight} />
      </WeightBar>
      {!exploration.active && (
        <InventoryList>
          {explorationItems
            .filter((resource) => {
              const resourceAmount = resources[resource];
              const explorationAmount = exploration.inventory[resource] || 0;
              if (resourceAmount > 0 && explorationAmount === 0) {
                return true;
              }
            })
            .map((resource) => {
              return (
                <InventoryItem key={resource}>
                  <span>{resource}</span>
                  <DropButton onClick={() => handleDrop(resource, -1)}>Add 1</DropButton>
                </InventoryItem>
              );
            })}
        </InventoryList>
      )}
      <InventoryList>
        {inventoryEntries.map(([resource, amount]) => {
          const weight = getResourceWeight(resource);
          return (
            <InventoryItem key={resource}>
              <span>
                {resource}: {amount}
                {weight > 0 && (
                  <span style={{ opacity: 0.6, marginLeft: 4 }}>
                    ({(weight * amount).toFixed(2)})
                  </span>
                )}
              </span>
              <DropButton onClick={() => handleDrop(resource)}>Drop 1</DropButton>
            </InventoryItem>
          );
        })}
      </InventoryList>
    </>
  );
};

export default ExplorationInventory;
