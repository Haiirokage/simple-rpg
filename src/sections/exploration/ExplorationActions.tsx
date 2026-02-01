import styled from "styled-components";
import { useEndExpedition, useHandleExploration } from "../../data/exploration/hooks";
import { useAdvanceTime, useTime } from "../../data/time/hooks";
import { Paragraph } from "../../style/elements";
import { useHandleKnowledge } from "../../data/knowledge/hooks";
import { useDiscoveries, useMutateDiscoveries } from "../../data/discoveries/hooks";
import { pickRandomDiscovery, useHasViableDiscoveries } from "../../data/discoveries/util";
import {
  FOREST_DISCOVERIES,
  REPEATABLE_DISCOVERIES,
} from "../../biome/forest/discovery-definitions";
import { useCallback } from "preact/hooks";
import { objectEntries } from "../../util";
import { useAddEventLogEntry } from "../../data/eventLog/hooks";
import { buildExplorationEventLog } from "../../events/exploration-events";
import { useEncounter, useSetEncounter } from "../../data/encounters/hooks";
import { ENCOUNTER_FRAMES } from "../../data/encounters/definitions";
import { useHandleEquipment } from "../../data/equipment/hooks";
import { getValueByLevel } from "../../data/equipment/util";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";

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
  const setEncounter = useSetEncounter();
  const { getTool } = useHandleEquipment();
  const { data: encounterState } = useEncounter();
  const { time, day, year } = useTime();
  const endExpedition = useEndExpedition();
  const { knowledge, gainLevels } = useHandleKnowledge("forest");
  const knowledgeLevel = knowledge.tier * 100 + knowledge.level;
  const discoveries = useDiscoveries();
  const mutateDiscoveries = useMutateDiscoveries();
  const advanceTime = useAdvanceTime();
  const addEventLogEntry = useAddEventLogEntry();
  const hasViableDiscoveries = useHasViableDiscoveries(knowledgeLevel, discoveries);
  const { updatePlayerStatus } = useHandlePlayerStatus();

  const timeRemaining = exploration.endTime ? exploration.endTime - time : 0;

  const lookAround = useCallback(() => {
    const { toolDefinition, toolStatus } = getTool("shoes");
    const tierDefinition = toolDefinition.tiers[toolStatus.tier];
    const discoveryMultiplier = getValueByLevel(
      toolStatus.level,
      tierDefinition.bonus.explorationChance,
    );
    const { discovery, repeatable } = pickRandomDiscovery(
      knowledgeLevel,
      discoveries,
      discoveryMultiplier,
    );
    const foundDiscoveryCount = discovery ? discoveries[discovery] || 0 : 0;

    if (repeatable) {
      addEventLogEntry(buildExplorationEventLog(repeatable, year, day, undefined));
      const rep_disc = REPEATABLE_DISCOVERIES[repeatable];
      if (rep_disc.triggerEncounter) {
        setEncounter(rep_disc.triggerEncounter);
      }
      gainLevels(1);
    } else if (discovery) {
      mutateDiscoveries({ [discovery]: foundDiscoveryCount + 1 });
      const { reward } = FOREST_DISCOVERIES[discovery];
      if (reward) {
        const newInventory = objectEntries(reward).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: (acc[key] || 0) + value,
          };
        }, exploration.inventory);

        mutateExploration({ inventory: newInventory });
      }
      gainLevels(1);
      addEventLogEntry(buildExplorationEventLog(discovery, year, day, foundDiscoveryCount));
    } else {
      console.log("found nothing");
    }
    advanceTime(1);
    updatePlayerStatus({ energy: -5 });
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
    gainLevels,
    setEncounter,
    getTool,
    updatePlayerStatus,
  ]);

  const encounterFrame = encounterState.encounterFrameId
    ? ENCOUNTER_FRAMES[encounterState.encounterFrameId]
    : undefined;

  const hasEnemies = Object.keys(encounterState.enemies).length > 0;
  const preventLeaving = encounterFrame?.preventLeaving || hasEnemies;

  const disabled = encounterState.active || timeRemaining <= 0;

  return (
    <ActionsContainer>
      {exploration.active && (
        <Paragraph>
          Time remaining: {timeRemaining}h (until hour {exploration.endTime})
        </Paragraph>
      )}
      <LookAroundButton disabled={disabled} hasViable={hasViableDiscoveries} onClick={lookAround}>
        Look Around
      </LookAroundButton>
      {discoveries.successful_hunt > 0 && (
        <button
          disabled={disabled}
          onClick={() => {
            updatePlayerStatus({ energy: -5 });
            if (Math.random() < knowledgeLevel / 300) {
              setEncounter("deer_tracks_found");
            } else {
              advanceTime(1);
            }
          }}
        >
          Track down a deer
        </button>
      )}
      {discoveries.find_tubers > 0 && (
        <button
          disabled={disabled}
          onClick={() => {
            updatePlayerStatus({ energy: -5 });
            if (Math.random() < knowledgeLevel / 250) {
              setEncounter("edable_roots");
            } else {
              advanceTime(1);
            }
          }}
        >
          Find some tubers
        </button>
      )}
      <button disabled={preventLeaving} onClick={() => endExpedition()}>
        Return Home
      </button>
    </ActionsContainer>
  );
};

export default ExplorationActions;
