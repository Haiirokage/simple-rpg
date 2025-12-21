import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import type { Attribute, AttributeStore } from "./types";

const defaultAttributeStore: AttributeStore = {
  strength: {
    level: 40,
    exp: 0,
  },
} as const;

export const getAttributes = (): AttributeStore => {
  return getStorage<AttributeStore>("ATTRIBUTES", defaultAttributeStore);
};

export const setAttributes = (attributes: AttributeStore) => {
  setStorage("ATTRIBUTES", attributes);
};

export const useAttributes = () => {
  const { data, refetch } = useQuery({
    queryKey: ["ATTRIBUTES"],
    queryFn: () => getAttributes(),
    initialData: defaultAttributeStore,
  });

  return {
    attributes: data,
    refetch,
  };
};

export const useMutateAttributes = () => {
  const { attributes } = useAttributes();

  return useMutation<void, Error, Partial<AttributeStore>>({
    mutationFn: async (updates) => {
      const merged = { ...attributes, ...updates };
      return setStorage("ATTRIBUTES", merged);
    },
    onMutate: (updates, context) => {
      const merged = { ...attributes, ...updates };
      context.client.setQueryData(["ATTRIBUTES"], merged);
    },
  });
};

export const useGrantExperience = () => {
  const { attributes } = useAttributes();
  const { mutate: mutateAttributes } = useMutateAttributes();

  const levelUpRecursively = (level: number, exp: number): Attribute => {
    if (level >= 100) {
      return { level: 100, exp };
    }

    const expThreshold = Math.pow(1.4, level);
    if (exp >= expThreshold) {
      return levelUpRecursively(level + 1, exp - expThreshold);
    }

    return { level, exp };
  };

  const grantExperience = (attributeName: keyof AttributeStore, amount: number) => {
    const attr = attributes[attributeName];
    const { level, exp } = levelUpRecursively(attr.level, attr.exp + amount);

    mutateAttributes({
      [attributeName]: { level, exp },
    });
  };

  return grantExperience;
};
