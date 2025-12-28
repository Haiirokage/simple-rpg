import styled from "styled-components";
import { useExploration, useEndExpedition } from "../../data/exploration/hooks";
import { useTime } from "../../data/time/hooks";
import { Paragraph } from "../../style/elements";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ExplorationActions = () => {
  const exploration = useExploration();
  const { time } = useTime();
  const endExpedition = useEndExpedition();

  const timeRemaining = exploration.endTime ? exploration.endTime - time : 0;

  return (
    <ActionsContainer>
      {exploration.active && (
        <Paragraph>
          Time remaining: {timeRemaining}h (until hour {exploration.endTime})
        </Paragraph>
      )}
      {/* Exploration actions will go here */}
      <button onClick={() => endExpedition()}>Return Home</button>
    </ActionsContainer>
  );
};

export default ExplorationActions;
