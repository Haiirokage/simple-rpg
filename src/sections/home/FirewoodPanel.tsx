import { useResources } from "../../data/resources/hooks";
import { useStructures } from "../../data/structures/hooks";
import { useTime } from "../../data/time/hooks";
import { getFirewoodCostPerDay } from "../../data/time/season-util";
import { getStorageCapacity } from "../../data/resources/util";
import styled from "styled-components";
import TooltipWrapper from "../../style/TooltipWrapper";

const CostDisplay = styled.span`
  color: red;
`;

const FirewoodPanel = () => {
  const { resources } = useResources();
  const { structures } = useStructures();
  const { day } = useTime();

  const dailyCost = getFirewoodCostPerDay(day);
  const capacity = getStorageCapacity("firewood", structures);
  const capacityStr = capacity === Infinity ? "?" : capacity.toString();

  return (
    <div style={{ fontFamily: "monospace" }}>
      <TooltipWrapper description="You will automatically burn a certain amount of firewood every new day. This effect is harshest in winter.">
        Firewood: {resources.firewood}/{capacityStr} <CostDisplay>(-{dailyCost})</CostDisplay>
      </TooltipWrapper>
    </div>
  );
};

export default FirewoodPanel;
