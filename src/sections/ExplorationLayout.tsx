import { GameSection, GameViewContainer } from "../style/game-view";
import PlayerStatus from "./PlayerStatus";

const ExplorationLayout = () => {
  return (
    <GameViewContainer>
      <GameSection area="status">
        <PlayerStatus />
      </GameSection>
    </GameViewContainer>
  );
};

export default ExplorationLayout;
