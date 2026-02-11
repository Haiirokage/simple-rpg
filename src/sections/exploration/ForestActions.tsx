import styled from "styled-components";
import {
  useEndExpedition,
  useHandleExploration,
  useLookAround,
} from "../../data/exploration/hooks";
import { useAdvanceTime, useTime } from "../../data/time/hooks";
import { Paragraph } from "../../style/elements";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { useHasViableDiscoveries } from "../../biome/discovery-util";
import { useSetEncounter, useHandleEncounter } from "../../data/encounters/hooks";
import { ENCOUNTER_FRAMES } from "../../data/encounters/definitions";
import { useHandleEquipment } from "../../data/equipment/hooks";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import { usePlayerForce } from "../../data/attributes/hooks";
import { getInventoryWeight, getCarryCapacity } from "../../data/resources/util";
import { isDay } from "../../data/time/season-util";
import TooltipWrapper from "../../style/TooltipWrapper";

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

const ForestActions = () => {
  const { exploration, mutateExploration, modifyActions } = useHandleExploration();
  const setEncounter = useSetEncounter();
  const { encounter } = useHandleEncounter();
  const { equipment } = useHandleEquipment();
  const { time, day } = useTime();
  const isNight = !isDay(time, day);
  const hasLight = (equipment.consumables.lantern?.current ?? 0) > 0;
  const endExpedition = useEndExpedition();
  const discoveries = useDiscoveries();
  const advanceTime = useAdvanceTime();
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const force = usePlayerForce();

  const { lookAround, knowledgeLevel } = useLookAround("forest");
  const hasViableDiscoveries = useHasViableDiscoveries("forest", knowledgeLevel, discoveries);

  const currentWeight = getInventoryWeight(exploration.inventory);
  const carryCapacity = getCarryCapacity(force);
  const overweight = currentWeight > carryCapacity;
  const noActions = exploration.actions.cur <= 0;
  const hasJerky = (exploration.inventory.jerky ?? 0) > 0;

  const encounterFrame = encounter.encounterFrameId
    ? ENCOUNTER_FRAMES[encounter.encounterFrameId]
    : undefined;

  const hasEnemies = Object.keys(encounter.enemies).length > 0;
  const preventLeaving = encounterFrame?.preventLeaving || hasEnemies;

  const disabled = encounter.active || overweight || noActions;

  const noLight = isNight && !hasLight;

  return (
    <ActionsContainer>
      {exploration.active && (
        <>
          <Paragraph>
            Actions remaining: {exploration.actions.cur} / {exploration.actions.max}
            {isNight && <span style={{ color: "#5c6bc0", float: "right" }}>It's dark out 🌙</span>}
          </Paragraph>
        </>
      )}
      <TooltipWrapper inline description={noLight ? "It's too dark to explore now." : undefined}>
        <LookAroundButton
          disabled={disabled || playerStatus.energy < 5 || noLight}
          hasViable={hasViableDiscoveries}
          onClick={lookAround}
        >
          Look Around
        </LookAroundButton>
      </TooltipWrapper>
      {discoveries.successful_hunt > 0 && (
        <button
          disabled={disabled || isNight || playerStatus.energy < 5}
          onClick={() => {
            modifyActions(-1);
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
      {discoveries.find_tubers > 0 && knowledgeLevel < 250 && (
        <button
          disabled={disabled || playerStatus.energy < 5}
          onClick={() => {
            modifyActions(-1);
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
      {discoveries.large_lake > 0 && (
        <button
          onClick={() => {
            mutateExploration({ location: "lake" });
          }}
        >
          Go to the lake
        </button>
      )}
      <button
        onClick={() => {
          mutateExploration({ biome: "village" });
        }}
      >
        Travel to village
      </button>
      {hasJerky && (
        <button
          onClick={() => {
            modifyActions(2);
            mutateExploration({
              inventory: {
                ...exploration.inventory,
                jerky: (exploration.inventory.jerky ?? 0) - 1,
              },
            });
          }}
        >
          Eat a ration
        </button>
      )}
      <button disabled={preventLeaving || overweight} onClick={() => endExpedition()}>
        Return Home
      </button>
    </ActionsContainer>
  );
};

export default ForestActions;
