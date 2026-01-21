import styled from "styled-components";
import { useTime } from "../data/time/hooks";
import { useStartExpedition, useExploration } from "../data/exploration/hooks";
import { usePlayerStatus } from "../data/playerStatus/hooks";
import { isActionWithinDaylight } from "../data/time/season-util";

const StyledButton = styled.button`
  padding: 8px 16px;
  margin-bottom: 8px;
`;

const EXPLORATION_TIME_LIMIT = 4;

const ExploreButton = () => {
  const { time, day } = useTime();
  const startExpedition = useStartExpedition();
  const { data: playerStatus } = usePlayerStatus();
  const exploration = useExploration();

  const canExplore = isActionWithinDaylight(time, EXPLORATION_TIME_LIMIT, day);

  return (
    <StyledButton
      disabled={exploration.active || !canExplore || playerStatus.energy < 20}
      onClick={() => startExpedition(time + EXPLORATION_TIME_LIMIT)}
    >
      Explore
    </StyledButton>
  );
};

export default ExploreButton;
