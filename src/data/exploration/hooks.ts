import { objectEntries } from "../../util";
import { useHandleResources } from "../resources/hooks";
import { useDataQuery, useUpdateData } from "../util";
import type { ExplorationStore } from "./types";
import { defaultExplorationStore } from "./types";

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

  return (endTime: number) => {
    mutateExploration({
      active: true,
      endTime,
      inventory: {},
    });
  };
};

export const useEndExpedition = () => {
  const { resources, mutateResources } = useHandleResources();
  const { exploration, mutateExploration } = useHandleExploration();

  return () => {
    const newResources = objectEntries(exploration.inventory).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: resources[key] + value,
      };
    }, {});

    mutateResources(newResources);
    mutateExploration({
      active: false,
      inventory: {},
    });
  };
};
