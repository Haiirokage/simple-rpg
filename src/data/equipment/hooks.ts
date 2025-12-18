import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import { defaultEquipmentStore, type EquipmentStore } from "./types";

export const getEquipment = (): EquipmentStore => {
  return getStorage<EquipmentStore>("EQUIPMENT", defaultEquipmentStore);
};

export const setEquipment = (equipment: EquipmentStore) => {
  setStorage("EQUIPMENT", equipment);
};

export const useEquipment = () => {
  const { data } = useQuery({
    queryKey: ["EQUIPMENT"],
    queryFn: () => getEquipment(),
    initialData: defaultEquipmentStore,
  });
  return data;
};

export const useUpdateEquipment = () => {
  const data = useEquipment();

  const { mutate } = useMutation<void, Error, Partial<EquipmentStore>>({
    mutationFn: async (updates) => setEquipment({ ...data, ...updates }),
    onMutate: (updates, context) => {
      context.client.setQueryData(["EQUIPMENT"], { ...data, ...updates });
    },
  });
  const mutateSpecific = <T extends keyof EquipmentStore>(
    key: T,
    updates: Partial<EquipmentStore[T]>,
  ) => {
    mutate({
      [key]: { ...data[key], ...updates },
    } as Partial<EquipmentStore>);
  };

  return { mutateSpecific, mutate };
};

export const useResetTraps = () => {
  const {
    consumables: { trap },
  } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();

  return () =>
    mutateSpecific("consumables", {
      trap: {
        ...trap,
        active: 0,
      },
    });
};
