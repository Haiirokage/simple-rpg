import styled from "styled-components";
import { useEndExpedition, useHandleExploration } from "../../data/exploration/hooks";
import { useAdvanceTime, useTime } from "../../data/time/hooks";
import { Paragraph } from "../../style/elements";
import { useHandleKnowledge } from "../../data/knowledge/hooks";
import { useDiscoveries, useMutateDiscoveries } from "../../data/discoveries/hooks";
import { pickRandomDiscovery } from "../../data/discoveries/util";
import { FOREST_DISCOVERIES } from "../../biome/forest/discovery-definitions";
import { useCallback, useEffect } from "preact/hooks";
import { objectEntries } from "../../util";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ExplorationActions = () => {
  const { exploration, mutateExploration } = useHandleExploration();
  const { time } = useTime();
  const endExpedition = useEndExpedition();
  const { knowledge } = useHandleKnowledge("forest");
  const knowledgeLevel = knowledge.tier * 100 + knowledge.level;
  const discoveries = useDiscoveries();
  const mutateDiscoveries = useMutateDiscoveries();
  const advanceTime = useAdvanceTime();

  const timeRemaining = exploration.endTime ? exploration.endTime - time : 0;

  useEffect(() => {
    if (exploration.active && timeRemaining <= 0) {
      endExpedition();
    }
  }, [timeRemaining, exploration.active, endExpedition]);

  const lookAround = useCallback(() => {
    const foundDiscovery = pickRandomDiscovery(knowledgeLevel, discoveries);

    if (foundDiscovery) {
      mutateDiscoveries({ [foundDiscovery]: (discoveries[foundDiscovery] || 0) + 1 });
      const reward = FOREST_DISCOVERIES[foundDiscovery].reward;
      if (reward) {
        const newInventory = objectEntries(reward).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: (acc[key] || 0) + value,
          };
        }, exploration.inventory);
        mutateExploration({
          inventory: newInventory,
        });
      }
      console.log(`found a ${foundDiscovery}!`);
    } else {
      console.log("found nothing");
    }
    advanceTime(1);
  }, [
    knowledgeLevel,
    discoveries,
    mutateDiscoveries,
    mutateExploration,
    exploration.inventory,
    advanceTime,
  ]);

  return (
    <ActionsContainer>
      {exploration.active && (
        <Paragraph>
          Time remaining: {timeRemaining}h (until hour {exploration.endTime})
        </Paragraph>
      )}
      <button onClick={lookAround}>Look Around</button>
      <button onClick={() => endExpedition()}>Return Home</button>
    </ActionsContainer>
  );
};

export default ExplorationActions;
