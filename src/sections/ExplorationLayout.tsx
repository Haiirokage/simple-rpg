import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import PlayerStatus from "./PlayerStatus";
import ExplorationActions from "./exploration/ExplorationActions";
import EventLog from "./EventLog";
import EncounterView from "./exploration/EncounterView";

const ExplorationGameContainer = styled(GameViewContainer)`
  grid-template-columns: auto auto auto auto;
  grid-template-areas: "status actions encounter log";
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
      <GameSection area="encounter">
        <EncounterView />
      </GameSection>
      <GameSection area="log">
        <EventLog />
      </GameSection>
    </ExplorationGameContainer>
  );
};

export default ExplorationLayout;
