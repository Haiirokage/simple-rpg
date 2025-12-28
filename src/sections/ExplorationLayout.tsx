import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import PlayerStatus from "./PlayerStatus";
import ExplorationActions from "./exploration/ExplorationActions";

const ExplorationGameContainer = styled(GameViewContainer)`
  grid-template-columns: auto auto;
  grid-template-areas:
    "status actions"
    "status actions";
`;

const ExplorationLayout = () => {
  return (
    <ExplorationGameContainer>
      <GameSection area="status">
        <PlayerStatus />
      </GameSection>
      <GameSection area="actions">
        <h2>Exploring forest</h2>
        <ExplorationActions />
      </GameSection>
    </ExplorationGameContainer>
  );
};

export default ExplorationLayout;
