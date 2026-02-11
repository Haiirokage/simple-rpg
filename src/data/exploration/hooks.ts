import { useDataQuery, useUpdateData, waitForCache } from "../util";
import { useAdvanceTime } from "../time/hooks";
import { useHandlePlayerStatus } from "../playerStatus/hooks";
import type { ExplorationStore } from "./types";
import { defaultExplorationStore, getMaxExplorationActions } from "./types";
import { useUpdateEncounter, useSetEncounter, useHandleEncounter } from "../encounters/hooks";
import { useAttributes } from "../attributes/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { clamp } from "lodash";
import { useCallback } from "preact/hooks";
import { useTime } from "../time/hooks";
import { isDay } from "../time/season-util";
import { useHandleEquipment } from "../equipment/hooks";
import { useHandleKnowledge } from "../knowledge/hooks";
import { useDiscoveries, useMutateDiscoveries } from "../discoveries/hooks";
import { useAddEventLogEntry } from "../eventLog/hooks";
import { pickRandomDiscovery } from "../../biome/discovery-util";
import { buildExplorationEventLog } from "../../events/exploration-events";
import { objectEntries } from "../../util";
import type { BiomeType } from "../../biome/discovery-types";

export const useExploration = () => {
  const { data } = useDataQuery<ExplorationStore>("EXPLORATION", defaultExplorationStore);

  return data;
};

export const useMutateExploration = () => {
  const queryClient = useQueryClient();
  const { mutate } = useUpdateData<ExplorationStore>("EXPLORATION", defaultExplorationStore);

  return {
    mutateExploration: (newStore: Partial<ExplorationStore>) =>
      waitForCache(queryClient, () => mutate(newStore)),
  };
};

export const useHandleExploration = () => {
  const exploration = useExploration();
  const { mutateExploration } = useMutateExploration();

  const modifyActions = (delta: number) => {
    mutateExploration({
      actions: {
        ...exploration.actions,
        cur: clamp(exploration.actions.cur + delta, 0, exploration.actions.max),
      },
    });
  };

  return { exploration, mutateExploration, modifyActions };
};

export const useStartExpedition = () => {
  const { mutateExploration } = useMutateExploration();
  const advanceTime = useAdvanceTime();
  const { updatePlayerStatus } = useHandlePlayerStatus();
  const { attributes } = useAttributes();

  return () => {
    advanceTime(1); // 1 hour travel time
    updatePlayerStatus({ energy: -5 });
    const maxActions = getMaxExplorationActions(attributes.constitution.level);
    mutateExploration({
      active: true,
      actions: { cur: maxActions, max: maxActions },
    });
  };
};

export const useEndExpedition = () => {
  const { mutate } = useUpdateEncounter();
  const { mutateExploration } = useHandleExploration();

  return () => {
    mutate({ exitMessage: undefined });
    mutateExploration({
      active: false,
    });
  };
};

export const useLookAround = (biome: BiomeType) => {
  const { exploration, mutateExploration, modifyActions } = useHandleExploration();
  const setEncounter = useSetEncounter();
  const { mutateEncounter } = useHandleEncounter();
  const { getTool } = useHandleEquipment();
  const { time, day, year } = useTime();
  const isNight = !isDay(time, day);
  const { knowledge, gainLevels } = useHandleKnowledge(biome);
  const knowledgeLevel = knowledge.tier * 100 + knowledge.level;
  const discoveries = useDiscoveries();
  const mutateDiscoveries = useMutateDiscoveries();
  const advanceTime = useAdvanceTime();
  const addEventLogEntry = useAddEventLogEntry();
  const { updatePlayerStatus } = useHandlePlayerStatus();

  const lookAround = useCallback(() => {
    const { bonuses } = getTool("shoes");
    const discoveryMultiplier = bonuses.explorationChance;
    const { discovery, repeatable } = pickRandomDiscovery(
      biome,
      knowledgeLevel,
      discoveries,
      discoveryMultiplier,
      isNight,
    );
    if (repeatable) {
      addEventLogEntry(buildExplorationEventLog(repeatable.type, year, day, undefined));
      if (repeatable.triggerEncounter) {
        setEncounter(repeatable.triggerEncounter);
      }

      gainLevels(1);
    } else if (discovery) {
      const foundDiscoveryCount = discoveries[discovery.type];
      mutateDiscoveries({ [discovery.type]: foundDiscoveryCount + 1 });
      mutateEncounter({ encounteredDiscovery: discovery.type });

      if (discovery.triggerEncounter) {
        setEncounter(discovery.triggerEncounter);
      }
      if (discovery.reward) {
        const newInventory = objectEntries(discovery.reward).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: (acc[key] || 0) + value }),
          exploration.inventory,
        );

        mutateExploration({ inventory: newInventory });
      }
      gainLevels(1);
      addEventLogEntry(buildExplorationEventLog(discovery.type, year, day, foundDiscoveryCount));
    } else {
      console.log("found nothing");
    }
    modifyActions(-1);
    advanceTime(1);
    updatePlayerStatus({ energy: -5 });
  }, [
    biome,
    knowledgeLevel,
    discoveries,
    mutateDiscoveries,
    mutateEncounter,
    mutateExploration,
    exploration.inventory,
    advanceTime,
    year,
    day,
    isNight,
    addEventLogEntry,
    gainLevels,
    setEncounter,
    getTool,
    modifyActions,
    updatePlayerStatus,
  ]);

  return { lookAround, knowledgeLevel, isNight };
};
