import styled from "styled-components";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { useHandleKnowledge } from "../../data/knowledge/hooks";
import { EXPLORATION_EVENTS } from "../../events/exploration-events";
import { objectEntries } from "../../util";
import { Header2, Header3 } from "../../style/elements";
import { useExploration } from "../../data/exploration/hooks";
import { BIOME_DISCOVERIES } from "../../biome/discovery-util";

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
  const { biome } = useExploration();
  const { knowledge } = useHandleKnowledge(biome);

  console.log(knowledge);

  const foundDiscoveries = objectEntries(BIOME_DISCOVERIES[biome].unlockable).filter(
    ([key]) => (discoveries[key] || 0) > 0,
  );

  return (
    <>
      <Header2>{biome}</Header2>
      <p>
        <strong>Knowledge Tier:</strong> {knowledge.tier} | <strong>Level:</strong>{" "}
        {knowledge.level}
      </p>
      <Header3>Discoveries</Header3>
      <BiomeContainer>
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
    </>
  );
};

export default BiomeOverview;
