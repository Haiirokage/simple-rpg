import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import type { AttributeStore } from "./types";
import { useCallback, useMemo } from "preact/hooks";
import { calculateForce } from "./util";
import { objectEntries } from "../../util";
import { levelUpRecursively } from "../leveling-util";

const defaultAttributeStore: AttributeStore = {
  strength: {
    level: 40,
    exp: 0,
  },
  constitution: {
    level: 30,
    exp: 0,
  },
  dexterity: {
    level: 20,
    exp: 0,
  },
  wisdom: {
    level: 15,
    exp: 0,
  },
} as const;

export const attributesQuery = makeDataQuery("ATTRIBUTES", defaultAttributeStore);

export const useAttributes = () => {
  const { data, refetch, isFetched } = useDefinedQuery(attributesQuery);

  return {
    attributes: data,
    refetch,
    isFetched,
  };
};

export const useMutateAttributes = () => {
  return useUpdateData<AttributeStore>("ATTRIBUTES", defaultAttributeStore);
};

export const useGrantExperience = () => {
  const { attributes } = useAttributes();
  const { mutate: mutateAttributes } = useMutateAttributes();

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
    [attributes, mutateAttributes],
  );

  return grantExperience;
};

export const usePlayerForce = () => {
  const { attributes } = useAttributes();

  return useMemo(() => calculateForce(attributes.strength.level), [attributes.strength.level]);
};
