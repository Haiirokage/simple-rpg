import styled from "styled-components";
import {
  useEndExpedition,
  useHandleExploration,
  useLookAround,
} from "../../data/exploration/hooks";
import { Paragraph } from "../../style/elements";
import { getInventoryWeight, getCarryCapacity } from "../../data/resources/util";
import { usePlayerForce } from "../../data/attributes/hooks";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { useHasViableDiscoveries } from "../../biome/discovery-util";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import { LookAroundButton } from "./styled-components";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VillageExploration = () => {
  const { exploration, mutateExploration } = useHandleExploration();
  const endExpedition = useEndExpedition();
  const force = usePlayerForce();
  const discoveries = useDiscoveries();
  const { playerStatus } = useHandlePlayerStatus();

  const { lookAround, knowledgeLevel } = useLookAround("village");
  const hasViableDiscoveries = useHasViableDiscoveries("village", knowledgeLevel, discoveries);

  const currentWeight = getInventoryWeight(exploration.inventory);
  const carryCapacity = getCarryCapacity(force);
  const overweight = currentWeight > carryCapacity;
  const noActions = exploration.actions.cur <= 0;

  return (
    <ActionsContainer>
      <Paragraph>
        Actions remaining: {exploration.actions.cur} / {exploration.actions.max}
      </Paragraph>
      <p>
        You arrive at a small village nestled at the edge of the forest. There's fields flanking you
        on each side and there are some houses in the distance.
      </p>
      <LookAroundButton
        disabled={overweight || noActions || playerStatus.energy < 5}
        hasViable={hasViableDiscoveries}
        onClick={lookAround}
      >
        Look Around
      </LookAroundButton>
      {discoveries.village_tavern > 0 && (
        <button
          onClick={() => {
            mutateExploration({ location: "tavern" });
          }}
        >
          Go to the tavern
        </button>
      )}
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
