import { useDataQuery, useUpdateData } from "../util";
import type { KnowledgeStore } from "./types";

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
