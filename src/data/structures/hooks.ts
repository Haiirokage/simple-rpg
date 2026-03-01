import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import { STRUCTURES } from "./definitions";
import { getBerryIncomeMultiplier } from "../time/season-util";
import { useCallback } from "preact/hooks";

export type StructureKey = "berryPlanter" | "pantry" | "woodShed" | "stonePile" | "workshop";
export type StructuresStore = Record<StructureKey | "plots", number>;

const defaultStructuresStore: StructuresStore = {
  plots: 8,
  berryPlanter: 0,
  pantry: 0,
  woodShed: 0,
  stonePile: 0,
  workshop: 0,
};

export const structuresQuery = makeDataQuery("STRUCTURES", defaultStructuresStore);

export const useStructures = () => {
  const { data } = useDefinedQuery(structuresQuery);
  const usedPlots = STRUCTURES.reduce((sum, structure) => {
    return (
      sum + ((data[structure.key as keyof StructuresStore] as number) || 0) * structure.plotCost
    );
  }, 0);
  const { plots, ...structures } = data;

  const getBerryIncome = useCallback(
    (day: number) => {
      return Math.ceil(structures.berryPlanter * getBerryIncomeMultiplier(day) * 2);
    },
    [structures.berryPlanter],
  );

  return { plots: plots, usedPlots, structures, getBerryIncome };
};

export const useUpdateStructures = () => {
  const { mutate } = useUpdateData<StructuresStore>("STRUCTURES", defaultStructuresStore);
  return mutate;
};
