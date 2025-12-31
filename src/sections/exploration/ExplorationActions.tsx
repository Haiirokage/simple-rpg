import styled from "styled-components";
import { useEndExpedition, useHandleExploration } from "../../data/exploration/hooks";
import { useAdvanceTime, useTime } from "../../data/time/hooks";
import { Paragraph } from "../../style/elements";
import { useHandleKnowledge } from "../../data/knowledge/hooks";
import { useDiscoveries, useMutateDiscoveries } from "../../data/discoveries/hooks";
import { pickRandomDiscovery, useHasViableDiscoveries } from "../../data/discoveries/util";
import { FOREST_DISCOVERIES } from "../../biome/forest/discovery-definitions";
import { useCallback, useEffect } from "preact/hooks";
import { objectEntries } from "../../util";
import { useAddEventLogEntry } from "../../data/eventLog/hooks";
import { buildExplorationEventLog } from "../../events/exploration-events";

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LookAroundButton = styled.button<{ hasViable: boolean }>`
  ${(props) =>
    props.hasViable &&
    `
    background-color: #e8f5e9;
    border-color: #4caf50;
  `}
`;

const ExplorationActions = () => {
  const { exploration, mutateExploration } = useHandleExploration();
  const { time, day, year } = useTime();
  const endExpedition = useEndExpedition();
  const { knowledge } = useHandleKnowledge("forest");
  const knowledgeLevel = knowledge.tier * 100 + knowledge.level;
  const discoveries = useDiscoveries();
  const mutateDiscoveries = useMutateDiscoveries();
  const advanceTime = useAdvanceTime();
  const addEventLogEntry = useAddEventLogEntry();
  const hasViableDiscoveries = useHasViableDiscoveries(knowledgeLevel, discoveries);

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
      const { reward } = FOREST_DISCOVERIES[foundDiscovery];
      if (reward) {
        const newInventory = objectEntries(reward).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: (acc[key] || 0) + value,
          };
        }, exploration.inventory);

        mutateExploration({ inventory: newInventory });
      }
      addEventLogEntry(buildExplorationEventLog(foundDiscovery, year, day));
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
    year,
    day,
    addEventLogEntry,
  ]);

  return (
    <ActionsContainer>
      {exploration.active && (
        <Paragraph>
          Time remaining: {timeRemaining}h (until hour {exploration.endTime})
        </Paragraph>
      )}
      <LookAroundButton hasViable={hasViableDiscoveries} onClick={lookAround}>
        Look Around
      </LookAroundButton>
      <button onClick={() => endExpedition()}>Return Home</button>
    </ActionsContainer>
  );
};

export default ExplorationActions;
