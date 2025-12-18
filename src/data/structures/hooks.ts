import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import { STRUCTURES } from "./definitions";

export type Structure = "berryPlanter" | "pantry";
export type StructuresStore = Record<Structure | "plots", number>;

const defaultStructuresStore: StructuresStore = {
  plots: 8,
  berryPlanter: 0,
  pantry: 0,
};

export const getStructures = (): StructuresStore => {
  return getStorage<StructuresStore>("STRUCTURES", defaultStructuresStore);
};

export const setStructures = (structures: StructuresStore) => {
  setStorage("STRUCTURES", structures);
};

export const useStructureStore = () =>
  useQuery({
    queryKey: ["STRUCTURES"],
    queryFn: () => getStructures(),
    initialData: defaultStructuresStore,
  });

export const useStructures = () => {
  const { data } = useStructureStore();
  const usedPlots = STRUCTURES.reduce((sum, structure) => {
    return (
      sum +
      ((data[structure.key as keyof StructuresStore] as number) || 0) *
        structure.plotCost
    );
  }, 0);
  const { plots, ...structures } = data;
  return { plots: plots, usedPlots, structures };
};

export const useUpdateStructures = () => {
  const { data: structures } = useStructureStore();
  const { mutate } = useMutation<void, Error, Partial<StructuresStore>>({
    mutationFn: async (updates) => setStructures({ ...structures, ...updates }),
    onMutate: (updates, context) => {
      context.client.setQueryData(["STRUCTURES"], {
        ...structures,
        ...updates,
      });
    },
  });
  return mutate;
};
