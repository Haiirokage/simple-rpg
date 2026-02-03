import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import PlayerStatus from "./PlayerStatus";
import ExplorationActions from "./exploration/ExplorationActions";
import EventLog, { EventLogSection } from "./EventLog";
import EncounterView from "./exploration/EncounterView";
import BiomeOverview from "./overview/BiomeOverview";
import ExplorationInventory from "./exploration/ExplorationInventory";

const ExplorationGameContainer = styled(GameViewContainer)`
  grid-template-columns: 250px 400px 400px 280px;
  grid-template-areas:
    "status actions encounter log"
    "inventory biome biome log";
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
      <EventLogSection area="log">
        <EventLog />
      </EventLogSection>
      <GameSection area="inventory">
        <ExplorationInventory />
      </GameSection>
      <GameSection area="biome">
        <BiomeOverview />
      </GameSection>
    </ExplorationGameContainer>
  );
};

export default ExplorationLayout;
