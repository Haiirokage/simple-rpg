import { useDataQuery, useUpdateData } from "../util";
import type { Attribute, AttributeStore } from "./types";
import { useCallback, useMemo } from "preact/hooks";
import { calculateForce } from "./util";
import { objectEntries } from "../../util";

const defaultAttributeStore: AttributeStore = {
  strength: {
    level: 40,
    exp: 0,
  },
  constitution: {
    level: 30,
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

  const levelUpRecursively = useCallback((level: number, exp: number): Attribute => {
    if (level >= 100) {
      return { level: 100, exp };
    }

    const expThreshold = Math.pow(1.4, level);
    if (exp >= expThreshold) {
      return levelUpRecursively(level + 1, exp - expThreshold);
    }

    return { level, exp };
  }, []);

  const grantExperience = useCallback(
    (experience: Partial<Record<keyof AttributeStore, number>>) => {
      const updated = objectEntries(experience).reduce((acc, [attributeName, amount]) => {
        const attr = attributes[attributeName];
        const { level, exp } = levelUpRecursively(attr.level, attr.exp + amount);
        return {
          ...acc,
          [attributeName]: { level, exp },
        };
      }, {} as Partial<AttributeStore>);

      mutateAttributes(updated as AttributeStore);
    },
    [attributes, mutateAttributes, levelUpRecursively],
  );

  return grantExperience;
};

export const usePlayerForce = () => {
  const { attributes } = useAttributes();

  return useMemo(() => calculateForce(attributes.strength.level), [attributes.strength.level]);
};
