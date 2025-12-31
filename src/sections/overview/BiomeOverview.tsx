import styled from "styled-components";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { FOREST_DISCOVERIES } from "../../biome/forest/discovery-definitions";
import { objectEntries } from "../../util";

const BiomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DiscoveryItem = styled.div`
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
`;

const BiomeOverview = () => {
  const discoveries = useDiscoveries();

  const foundDiscoveries = objectEntries(FOREST_DISCOVERIES).filter(
    ([key]) => (discoveries[key] || 0) > 0,
  );

  return (
    <BiomeContainer>
      <h2>Forest Discoveries</h2>
      {foundDiscoveries.length === 0 ? (
        <p>No discoveries yet</p>
      ) : (
        foundDiscoveries.map(([key, definition]) => (
          <DiscoveryItem key={key}>
            {definition.type.replace(/_/g, " ")} ({discoveries[key]}/{definition.maxCount})
          </DiscoveryItem>
        ))
      )}
    </BiomeContainer>
  );
};

export default BiomeOverview;
