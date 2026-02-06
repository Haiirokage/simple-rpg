import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import PlayerStatus from "./PlayerStatus";
import ExplorationActions from "./exploration/ExplorationActions";
import EventLog, { EventLogSection } from "./EventLog";
import EncounterView from "./exploration/EncounterView";
import BiomeOverview from "./overview/BiomeOverview";
import ExplorationInventory from "./exploration/ExplorationInventory";
import { useExploration } from "../data/exploration/hooks";
import LocationView from "./exploration/LocationView";
import PlayerEquipment from "./home/PlayerEquipment";

const ExplorationGameContainer = styled(GameViewContainer)<{ hasLocation: boolean }>`
  grid-template-columns: 250px 400px 400px 280px;
  grid-template-areas:
    "status ${(props) => (!props.hasLocation ? "actions encounter" : "location location")} log"
    "inventory biome biome log";
`;

const ExplorationLayout = () => {
  const { location } = useExploration();
  const hasLocation = !!location;

  return (
    <ExplorationGameContainer hasLocation={hasLocation}>
      <GameSection area="status">
        <PlayerStatus />
        <PlayerEquipment />
      </GameSection>
      {hasLocation ? (
        <GameSection area="location">
          <LocationView location={location} />
        </GameSection>
      ) : (
        <>
          <GameSection area="actions">
            <h2>Exploring forest</h2>
            <ExplorationActions />
          </GameSection>
          <GameSection area="encounter">
            <EncounterView />
          </GameSection>
        </>
      )}
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
