import { useCallback } from "preact/hooks";
import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import type { SmithingKnowledgeMap, SmithingTopicId } from "./types";

const defaultSmithingStore: SmithingKnowledgeMap = {
  copper: { ore: false },
  smelting: { basics: false },
  casting: { knifeBlade: false, basicShapes: false },
};

export const smithingQuery = makeDataQuery("SMITHING", defaultSmithingStore);

export const useSmithing = () => {
  const { data } = useDefinedQuery(smithingQuery);
  return data;
};

export const useSmithingActions = () => {
  const smithing = useSmithing();
  const { mutate } = useUpdateData<SmithingKnowledgeMap>("SMITHING", defaultSmithingStore);

  const unlockKnowledge = useCallback(
    <T extends SmithingTopicId>(topic: T, key: keyof SmithingKnowledgeMap[T]) => {
      mutate({ [topic]: { ...smithing[topic], [key]: true } } as Partial<SmithingKnowledgeMap>);
    },
    [smithing, mutate],
  );

  return { smithing, unlockKnowledge };
};
