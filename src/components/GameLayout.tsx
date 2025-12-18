import styled from "styled-components";
import ResourceBox from "../sections/ResourceBox";
import PlayerEquipment from "../sections/PlayerEquipment";
import PlayerStatus from "../sections/PlayerStatus";
import ForestBiome from "./actions/ForestBiome";
import HomeUpgrades from "./actions/HomeUpgrades";
import HomeConstruction from "./actions/HomeConstruction";
import PlayerActions from "../sections/PlayerActions";

const GameSection = styled.section`
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
  background-color: #fafafa;

  h2 {
    margin: 0 0 8px;
  }
`;

const GameField = styled.div`
  padding: 8px;
  display: grid;
  grid-template-columns: auto auto auto;
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
    <>
      <GameField>
        <GameSection>
          <PlayerStatus />
          <PlayerEquipment />
        </GameSection>
        <GameSection>
          <h2>Resources</h2>
          <ResourceBox />
        </GameSection>
        <ForestSection>
          <h2>Forest</h2>
          <ForestBiome />
        </ForestSection>
      </GameField>
      <GameField>
        <HomeSection>
          <h2>Home</h2>
          <HomeUpgrades />
        </HomeSection>
        <GameSection>
          <h2>Construction</h2>
          <HomeConstruction />
        </GameSection>
        <GameSection>
          <h2>Actions</h2>
          <PlayerActions />
        </GameSection>
      </GameField>
    </>
  );
};
