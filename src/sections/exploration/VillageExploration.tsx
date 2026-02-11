import styled from "styled-components";
import { useEndExpedition, useHandleExploration } from "../../data/exploration/hooks";
import { Paragraph } from "../../style/elements";
import { getInventoryWeight, getCarryCapacity } from "../../data/resources/util";
import { usePlayerForce } from "../../data/attributes/hooks";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VillageExploration = () => {
  const { exploration, mutateExploration } = useHandleExploration();
  const endExpedition = useEndExpedition();
  const force = usePlayerForce();

  const currentWeight = getInventoryWeight(exploration.inventory);
  const carryCapacity = getCarryCapacity(force);
  const overweight = currentWeight > carryCapacity;

  return (
    <ActionsContainer>
      <Paragraph>
        Actions remaining: {exploration.actions.cur} / {exploration.actions.max}
      </Paragraph>
      <p>You arrive at a small village nestled at the edge of the forest.</p>
      <button
        onClick={() => {
          mutateExploration({ biome: "forest" });
        }}
      >
        Return to forest
      </button>
      <button disabled={overweight} onClick={() => endExpedition()}>
        Return Home
      </button>
    </ActionsContainer>
  );
};

export default VillageExploration;
