import { useHandleResources } from "../resources/hooks";
import { useDataQuery, useUpdateData } from "../util";
import { useAdvanceTime } from "../time/hooks";
import { useHandlePlayerStatus } from "../playerStatus/hooks";
import type { ExplorationStore } from "./types";
import { defaultExplorationStore } from "./types";
import { useUpdateEncounter } from "../encounters/hooks";

export const useExploration = () => {
  const { data } = useDataQuery<ExplorationStore>("EXPLORATION", defaultExplorationStore);

  return data;
};

export const useMutateExploration = () => {
  const { mutate } = useUpdateData<ExplorationStore>("EXPLORATION", defaultExplorationStore);

  return {
    mutateExploration: mutate,
  };
};

export const useHandleExploration = () => {
  const exploration = useExploration();
  const { mutateExploration } = useMutateExploration();

  return { exploration, mutateExploration };
};

export const useStartExpedition = () => {
  const { mutateExploration } = useMutateExploration();
  const advanceTime = useAdvanceTime();
  const { updatePlayerStatus } = useHandlePlayerStatus();

  return (endTime: number) => {
    advanceTime(1); // 1 hour travel time
    updatePlayerStatus({ energy: -5 });
    mutateExploration({
      active: true,
      endTime,
      inventory: {},
    });
  };
};

export const useEndExpedition = () => {
  const { addResources } = useHandleResources();
  const { mutate } = useUpdateEncounter();
  const { exploration, mutateExploration } = useHandleExploration();

  return () => {
    addResources(exploration.inventory);
    mutate({ exitMessage: undefined });
    mutateExploration({
      active: false,
      inventory: {},
    });
  };
};
