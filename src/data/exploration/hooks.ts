import { useDataQuery, useUpdateData, waitForCache } from "../util";
import { useAdvanceTime } from "../time/hooks";
import { useHandlePlayerStatus } from "../playerStatus/hooks";
import type { ExplorationStore } from "./types";
import { defaultExplorationStore, getMaxExplorationActions } from "./types";
import { useUpdateEncounter } from "../encounters/hooks";
import { useAttributes } from "../attributes/hooks";
import { useQueryClient } from "@tanstack/react-query";

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

  const consumeAction = (count = 1) => {
    console.log("consume");
    mutateExploration({
      actions: { ...exploration.actions, cur: Math.max(0, exploration.actions.cur - count) },
    });
  };

  const restoreActions = (count: number) => {
    mutateExploration({
      actions: {
        ...exploration.actions,
        cur: Math.min(exploration.actions.max, exploration.actions.cur + count),
      },
    });
  };

  return { exploration, mutateExploration, consumeAction, restoreActions };
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
