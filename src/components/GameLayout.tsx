import styled from "styled-components";
import { GameSection, GameViewContainer } from "../style/game-view";
import ResourceBox from "../sections/home/ResourceBox";
import PlayerEquipment from "../sections/home/PlayerEquipment";
import PlayerStatus from "../sections/PlayerStatus";
import PlayerAttributes from "../sections/home/PlayerAttributes";
import EventLog, { EventLogSection } from "../sections/EventLog";
import ForestBiome from "./actions/ForestBiome";
import HomeUpgrades from "./actions/HomeUpgrades";
import HomeConstruction from "./actions/HomeConstruction";
import PlayerActions from "../sections/home/PlayerActions";

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

export const GameLayout = () => {
  return (
    <GameViewContainer
      templateColumns="auto auto auto auto auto"
      templateAreas={`
        "status attributes resources forest eventLog"
        "home construction construction actions eventLog"
      `}
    >
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
        <ForestBiome />
      </ForestSection>
      <EventLogSection area="eventLog">
        <EventLog />
      </EventLogSection>
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
    </GameViewContainer>
  );
};
