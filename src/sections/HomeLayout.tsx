import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import ResourceBox from "./home/ResourceBox";
import PlayerEquipment from "./home/PlayerEquipment";
import PlayerStatus from "./PlayerStatus";
import PlayerAttributes from "./home/PlayerAttributes";
import EventLog from "./EventLog";
import ForestBiome from "../components/actions/ForestBiome";
import ExploreButton from "../components/ExploreButton";
import HomeUpgrades from "../components/actions/HomeUpgrades";
import HomeConstruction from "../components/actions/HomeConstruction";
import PlayerActions from "./home/PlayerActions";

const HomeGameContainer = styled(GameViewContainer)`
  grid-template-columns: auto auto auto auto auto;
  grid-template-areas:
    "status attributes resources forest eventLog"
    "home construction construction actions eventLog";
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
      <GameSection area="resources">
        <h2>Resources</h2>
        <ResourceBox />
      </GameSection>
      <ForestSection area="forest">
        <h2>Forest</h2>
        <ExploreButton />
        <ForestBiome />
      </ForestSection>
      <GameSection area="eventLog">
        <EventLog />
      </GameSection>
      <HomeSection area="home">
        <h2>Home</h2>
        <HomeUpgrades />
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
