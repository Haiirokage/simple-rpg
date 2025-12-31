import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import ResourceBox from "./home/ResourceBox";
import PlayerEquipment from "./home/PlayerEquipment";
import PlayerStatus from "./PlayerStatus";
import PlayerAttributes from "./home/PlayerAttributes";
import EventLog from "./EventLog";
import BiomeOverview from "./overview/BiomeOverview";

const OverviewGameContainer = styled(GameViewContainer)`
  grid-template-columns: auto auto auto auto auto;
  grid-template-areas:
    "status attributes resources biome eventLog"
    "status attributes resources biome eventLog";
`;

const OverviewLayout = () => {
  return (
    <OverviewGameContainer>
      <GameSection area="status">
        <PlayerStatus />
        <PlayerEquipment />
      </GameSection>
      <GameSection area="attributes">
        <PlayerAttributes />
      </GameSection>
      <GameSection area="resources">
        <h2>Resources</h2>
        <ResourceBox />
      </GameSection>
      <GameSection area="biome">
        <BiomeOverview />
      </GameSection>
      <GameSection area="eventLog">
        <EventLog />
      </GameSection>
    </OverviewGameContainer>
  );
};

export default OverviewLayout;
