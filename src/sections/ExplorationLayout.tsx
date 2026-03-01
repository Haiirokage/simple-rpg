import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import PlayerStatus from "./PlayerStatus";
import ForestActions from "./exploration/ForestActions";
import VillageExploration from "./exploration/VillageExploration";
import EventLog, { EventLogSection } from "./EventLog";
import EncounterView from "./exploration/EncounterView";
import BiomeOverview from "./overview/BiomeOverview";
import ExplorationInventory from "./exploration/ExplorationInventory";
import { useExploration } from "../data/exploration/hooks";
import { useHandleEncounter } from "../data/encounters/hooks";
import LocationView from "./exploration/LocationView";
import CombatView from "./combat/CombatView";
import PlayerEquipment from "./home/PlayerEquipment";

const ExplorationGameContainer = styled(GameViewContainer)<{ hasFullWidthPanel: boolean }>`
  grid-template-columns: 250px 400px 400px 280px;
  grid-template-areas:
    "status ${(props) => (!props.hasFullWidthPanel ? "actions encounter" : "panel panel")} log"
    "inventory biome biome log";
`;

const ExplorationLayout = () => {
  const { location, biome } = useExploration();
  const { encounter } = useHandleEncounter();
  const inCombat = Object.keys(encounter.enemies).length > 0;
  const hasFullWidthPanel = !!location || inCombat;

  return (
    <ExplorationGameContainer hasFullWidthPanel={hasFullWidthPanel}>
      <GameSection area="status">
        <PlayerStatus />
        <PlayerEquipment />
      </GameSection>
      {hasFullWidthPanel ? (
        <GameSection area="panel">
          {inCombat ? (
            <CombatView enemies={encounter.enemies} />
          ) : (
            <LocationView location={location!} />
          )}
        </GameSection>
      ) : (
        <>
          <GameSection area="actions">
            <h2>Exploring {biome}</h2>
            {biome === "forest" ? <ForestActions /> : <VillageExploration />}
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
