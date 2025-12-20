import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import type { KnowledgeStore } from "./types";

const defaultKnowledgeStore: KnowledgeStore = {
  forest: {
    tier: 1,
    level: 20,
  },
} as const;

export const getKnowledge = (): KnowledgeStore => {
  return getStorage<KnowledgeStore>("KNOWLEDGE", defaultKnowledgeStore);
};

export const setKnowledge = (knowledge: KnowledgeStore) => {
  setStorage("KNOWLEDGE", knowledge);
};

export const useKnowledge = () => {
  const { data, refetch } = useQuery({
    queryKey: ["KNOWLEDGE"],
    queryFn: () => getKnowledge(),
    initialData: defaultKnowledgeStore,
  });

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
  const { knowledge } = useKnowledge();

  return useMutation<void, Error, KnowledgeStore>({
    mutationFn: async (updates) => {
      const merged = { ...knowledge, ...updates };
      return setStorage("KNOWLEDGE", merged);
    },
    onMutate: (updates, context) => {
      const merged = { ...knowledge, ...updates };
      context.client.setQueryData(["KNOWLEDGE"], merged);
    },
  });
};
