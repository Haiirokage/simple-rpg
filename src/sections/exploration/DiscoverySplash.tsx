import styled from "styled-components";
import type { DiscoveryType } from "../../biome/forest/discovery-definitions";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { useHandleEncounter } from "../../data/encounters/hooks";
import { EXPLORATION_EVENTS } from "../../events/exploration-events";

const SplashContainer = styled.div`
  text-align: center;
  padding: 0.5rem;
`;

const DiscoveryName = styled.h3`
  margin: 0.5rem 0 1rem;
`;

const ContinueButton = styled.button`
  padding: 0.5rem 1rem;
`;

interface DiscoverySplashProps {
  discovery: DiscoveryType;
}

const DiscoverySplash = ({ discovery }: DiscoverySplashProps) => {
  const discoveries = useDiscoveries();
  const { mutateEncounter } = useHandleEncounter();

  const event = EXPLORATION_EVENTS[discovery];
  const count = discoveries[discovery] ?? 0;
  const descriptionIndex = Math.min(count - 1, event.descriptions.length - 1);
  const description = event.descriptions[Math.max(0, descriptionIndex)];

  const handleContinue = () => {
    mutateEncounter({ encounteredDiscovery: undefined });
  };

  return (
    <SplashContainer>
      <DiscoveryName>{event.name}</DiscoveryName>
      <p>{description}</p>
      <ContinueButton onClick={handleContinue}>Continue</ContinueButton>
    </SplashContainer>
  );
};

export default DiscoverySplash;
