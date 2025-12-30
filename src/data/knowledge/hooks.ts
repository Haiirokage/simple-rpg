import { useDataQuery, useUpdateData } from "../util";
import type { KnowledgeStore, KnowledgeTier } from "./types";
import { useCallback } from "preact/hooks";

const defaultKnowledgeStore: KnowledgeStore = {
  forest: {
    tier: 1,
    level: 20,
  },
} as const;

export const useKnowledge = () => {
  const { data, refetch } = useDataQuery<KnowledgeStore>("KNOWLEDGE", defaultKnowledgeStore);

  return {
    knowledge: data,
    refetch,
  };
};
export const useSpecificKnowledge = (region: keyof KnowledgeStore) => {
  const { knowledge, refetch } = useKnowledge();

  return { knowledge: knowledge[region], refetch };
};

export const useMutateKnowledge = () => {
  return useUpdateData<KnowledgeStore>("KNOWLEDGE", defaultKnowledgeStore);
};

/**
 * Hook for managing knowledge with automatic level overflow handling.
 * Provides gainLevels function that handles tier advancement and capping.
 */
export const useHandleKnowledge = (region: keyof KnowledgeStore) => {
  const { knowledge } = useSpecificKnowledge(region);
  const { mutate } = useMutateKnowledge();

  const gainLevels = useCallback(
    (levelGain: number) => {
      const newLevel = knowledge.level + levelGain;
      const tierGain = Math.floor(newLevel / 100);
      const newTier = Math.min(knowledge.tier + tierGain, 3) as KnowledgeTier;

      // If at max tier, cap level at 100; otherwise wrap level
      const finalLevel = knowledge.tier === 3 ? Math.min(newLevel, 100) : newLevel % 100;

      mutate({
        [region]: {
          level: finalLevel,
          tier: newTier,
        },
      });
    },
    [knowledge.level, knowledge.tier, region, mutate],
  );

  return { knowledge, gainLevels };
};
