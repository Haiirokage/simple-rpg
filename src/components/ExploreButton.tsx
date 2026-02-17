import styled from "styled-components";
import { useStartExpedition, useExploration } from "../data/exploration/hooks";
import { usePlayerStatus } from "../data/playerStatus/hooks";

const StyledButton = styled.button`
  padding: 8px 16px;
  margin-bottom: 8px;
`;

const ExploreButton = () => {
  const startExpedition = useStartExpedition();
  const { data: playerStatus } = usePlayerStatus();
  const exploration = useExploration();

  return (
    <StyledButton
      disabled={exploration.active || playerStatus.energy < 20}
      onClick={() => startExpedition()}
    >
      Explore
    </StyledButton>
  );
};

export default ExploreButton;
