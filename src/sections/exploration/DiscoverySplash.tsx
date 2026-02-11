import styled from "styled-components";
import type { AllUnlockables } from "../../biome/discovery-types";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { useHandleEncounter } from "../../data/encounters/hooks";
import type { ExplorationEvent } from "../../events/types";

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
  event: ExplorationEvent;
}

const DiscoverySplash = ({ event }: DiscoverySplashProps) => {
  const discoveries = useDiscoveries();
  const { mutateEncounter } = useHandleEncounter();

  const count = discoveries[event.id as AllUnlockables];
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
