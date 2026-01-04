import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import ResourceBox from "./home/ResourceBox";
import PlayerEquipment from "./home/PlayerEquipment";
import PlayerStatus from "./PlayerStatus";
import PlayerAttributes from "./home/PlayerAttributes";
import PlayerSkills from "./home/PlayerSkills";
import EventLog, { EventLogSection } from "./EventLog";
import BiomeOverview from "./overview/BiomeOverview";

const OverviewGameContainer = styled(GameViewContainer)`
  grid-template-columns: auto auto auto auto;
  grid-template-areas:
    "status attributes skills . eventLog"
    "resources biome biome biome eventLog";
`;

const BiomeSection = styled(GameSection)`
  max-width: 800px;
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
      <GameSection area="skills">
        <PlayerSkills />
      </GameSection>
      <GameSection area="resources">
        <h2>Resources</h2>
        <ResourceBox />
      </GameSection>
      <BiomeSection area="biome">
        <BiomeOverview />
      </BiomeSection>
      <EventLogSection area="eventLog">
        <EventLog />
      </EventLogSection>
    </OverviewGameContainer>
  );
};

export default OverviewLayout;
