import styled from "styled-components";
import ResourceBox from "../sections/ResourceBox";
import PlayerEquipment from "../sections/PlayerEquipment";
import PlayerStatus from "../sections/PlayerStatus";
import PlayerAttributes from "../sections/PlayerAttributes";
import EventLog from "../sections/EventLog";
import ForestBiome from "./actions/ForestBiome";
import HomeUpgrades from "./actions/HomeUpgrades";
import HomeConstruction from "./actions/HomeConstruction";
import PlayerActions from "../sections/PlayerActions";

const GameSection = styled.section<{ area: string }>`
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
  background-color: #fafafa;
  ${(props) => `grid-area: ${props.area};`}

  h2 {
    margin: 0 0 8px;
  }
`;

const GameContainer = styled.div`
  padding: 8px;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  grid-template-areas:
    "status attributes resources forest eventLog"
    "home construction construction actions eventLog";
  gap: 12px;
  width: fit-content;
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

export const GameLayout = () => {
  return (
    <GameContainer>
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
    </GameContainer>
  );
};
