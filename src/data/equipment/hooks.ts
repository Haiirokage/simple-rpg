import { useDataQuery, useUpdateData } from "../util";
import {
  defaultEquipmentStore,
  type EquipmentStore,
  type ToolStatus,
  type ToolType,
} from "./types";

export const useEquipment = () => {
  const { data } = useDataQuery<EquipmentStore>("EQUIPMENT", defaultEquipmentStore);
  return data;
};

export const useUpdateEquipment = () => {
  const data = useEquipment();

  const { mutate } = useUpdateData<EquipmentStore>("EQUIPMENT", defaultEquipmentStore);
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

export const useHandleEquipment = () => {
  const equipment = useEquipment();

  const getTool = (toolType: ToolType): ToolStatus => {
    return equipment.tools[toolType] || { tier: 0, level: 1 };
  };
  return { equipment, getTool };
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
