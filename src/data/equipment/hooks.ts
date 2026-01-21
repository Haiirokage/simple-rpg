import { useDataQuery, useUpdateData } from "../util";
import { TOOL_DEFINITIONS, type EquipmentBonusType } from "./definitions";
import { defaultEquipmentStore, type EquipmentStore, type ToolType } from "./types";
import { getValueByLevel } from "./util";

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

  const getTool = (toolType: ToolType) => {
    const toolStatus = equipment.tools[toolType] || { tier: 0, level: 1 };
    return { toolStatus, toolDefinition: TOOL_DEFINITIONS[toolType] };
  };
  const getEquipmentBonus = (toolType: ToolType, bonusType: EquipmentBonusType) => {
    const { toolStatus, toolDefinition } = getTool(toolType);
    const tierDefinition = toolDefinition.tiers[toolStatus.tier];

    return getValueByLevel(toolStatus.level, tierDefinition.bonus[bonusType]);
  };

  return { equipment, getTool, getEquipmentBonus };
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
