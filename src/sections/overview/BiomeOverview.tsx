import styled from "styled-components";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { FOREST_DISCOVERIES } from "../../biome/forest/discovery-definitions";
import { EXPLORATION_EVENTS } from "../../events/exploration-events";
import { objectEntries } from "../../util";

const BiomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DiscoveryItem = styled.div`
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const DiscoveryLabel = styled.div`
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 6px;
  color: #333;
`;

const DiscoveryDescription = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: #555;
  padding: 4px 0;
  border-left: 2px solid #ddd;
  padding-left: 8px;

  &:not(:last-child) {
    margin-bottom: 6px;
  }
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
        foundDiscoveries.map(([key, definition]) => {
          const count = discoveries[key] || 0;
          const event = EXPLORATION_EVENTS[key as keyof typeof EXPLORATION_EVENTS];
          const descriptions = event?.descriptions || [];

          return (
            <DiscoveryItem key={key}>
              <DiscoveryLabel>
                {definition.type.replace(/_/g, " ")} ({count}/{definition.maxCount})
              </DiscoveryLabel>
              {Array.from({ length: Math.min(count, descriptions.length) }).map((_, index) => (
                <DiscoveryDescription key={index}>{descriptions[index]}</DiscoveryDescription>
              ))}
            </DiscoveryItem>
          );
        })
      )}
    </BiomeContainer>
  );
};

export default BiomeOverview;
