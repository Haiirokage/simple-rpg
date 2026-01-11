import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import ResourceBox from "./home/ResourceBox";
import PlayerEquipment from "./home/PlayerEquipment";
import PlayerStatus from "./PlayerStatus";
import PlayerAttributes from "./home/PlayerAttributes";
import PlayerSkills from "./home/PlayerSkills";
import EventLog, { EventLogSection } from "./EventLog";
import ForestBiome from "../components/actions/ForestBiome";
import HomeUpgrades from "../components/actions/HomeUpgrades";
import HomeActions from "../components/actions/HomeActions";
import HomeConstruction from "../components/actions/HomeConstruction";
import PlayerActions from "./home/PlayerActions";

const HomeGameContainer = styled(GameViewContainer)`
  grid-template-columns: auto auto auto auto auto auto;
  grid-template-areas:
    "status attributes skills resources forest eventLog"
    "home construction construction actions actions eventLog";
`;

const ForestSection = styled(GameSection)`
  .forest-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const HomeSection = styled(GameSection)`
  button {
    margin-bottom: 8px;
  }
`;

const HomeLayout = () => {
  return (
    <HomeGameContainer>
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
      <ForestSection area="forest">
        <h2>Forest</h2>
        <ForestBiome />
      </ForestSection>
      <EventLogSection area="eventLog">
        <EventLog />
      </EventLogSection>
      <HomeSection area="home">
        <h2>Home</h2>
        <HomeUpgrades />
        <HomeActions />
      </HomeSection>
      <GameSection area="construction">
        <h2>Construction</h2>
        <HomeConstruction />
      </GameSection>
      <GameSection area="actions">
        <h2>Actions</h2>
        <PlayerActions />
      </GameSection>
    </HomeGameContainer>
  );
};

export default HomeLayout;
