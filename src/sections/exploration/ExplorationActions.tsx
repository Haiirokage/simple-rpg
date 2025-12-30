import styled from "styled-components";
import { useEndExpedition, useHandleExploration } from "../../data/exploration/hooks";
import { useAdvanceTime, useTime } from "../../data/time/hooks";
import { Paragraph } from "../../style/elements";
import { useHandleKnowledge } from "../../data/knowledge/hooks";
import {
  useDiscoveries,
  useMutateDiscoveries,
  calculateDiscoveryChance,
} from "../../data/discoveries/hooks";
import { FOREST_DISCOVERIES } from "../../biome/forest/discovery-definitions";
import { useCallback, useEffect } from "preact/hooks";

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
    const berryDef = FOREST_DISCOVERIES.berry_patch;
    const chance = calculateDiscoveryChance(knowledgeLevel, berryDef, discoveries.berry_patch);

    console.log(chance);
    if (Math.random() < chance) {
      mutateDiscoveries({ berry_patch: discoveries.berry_patch + 1 });
      mutateExploration({
        inventory: {
          ...exploration.inventory,
          berry: (exploration.inventory.berry || 0) + 10,
        },
      });

      console.log("found a berry patch!");
    }
    advanceTime(1);
  }, [knowledgeLevel, discoveries, mutateDiscoveries, advanceTime, mutateExploration, exploration]);

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
