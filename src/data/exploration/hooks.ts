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
