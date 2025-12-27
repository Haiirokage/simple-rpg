import { useDataQuery, useUpdateData } from "../util";
import type { Attribute, AttributeStore } from "./types";

const defaultAttributeStore: AttributeStore = {
  strength: {
    level: 40,
    exp: 0,
  },
} as const;

export const useAttributes = () => {
  const { data, refetch } = useDataQuery<AttributeStore>("ATTRIBUTES", defaultAttributeStore);

  return {
    attributes: data,
    refetch,
  };
};

export const useMutateAttributes = () => {
  return useUpdateData<AttributeStore>("ATTRIBUTES", defaultAttributeStore);
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
