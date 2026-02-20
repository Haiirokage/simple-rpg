import { useCallback } from "preact/hooks";
import { mergeNumericRecords, objectEntries } from "../../util";
import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import {
  TOOL_DEFINITIONS,
  type EquipmentBonusType,
  type ToolBonusKeys,
  type ToolTier,
} from "./definitions";
import { defaultEquipmentStore, tools, type EquipmentStore, type ToolType } from "./types";
import type { Skills } from "../skills/types";
import { getValueByLevel, resolveSkillBonuses } from "./util";

export const equipmentQuery = makeDataQuery("EQUIPMENT", defaultEquipmentStore);

export const useEquipment = () => {
  const { data } = useDefinedQuery(equipmentQuery);
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

  const getTool = <T extends ToolType>(toolType: T) => {
    const toolStatus = equipment.tools[toolType] || { tier: 0, level: 1 };
    const toolDefinition = TOOL_DEFINITIONS[toolType];
    const tierDefinition = toolDefinition.tiers[toolStatus.tier];

    const bonuses = Object.fromEntries(
      objectEntries(tierDefinition.bonus).map(([key, range]) => [
        key,
        getValueByLevel(toolStatus.level, range),
      ]),
    ) as Record<ToolBonusKeys<T>, number>;

    const skillBonuses = resolveSkillBonuses(tierDefinition as ToolTier, toolStatus.level);

    return { toolStatus, toolDefinition, bonuses, skillBonuses };
  };

  const getEquipmentBonus = (toolType: ToolType, bonusType: EquipmentBonusType) => {
    const { toolStatus, toolDefinition } = getTool(toolType);
    const tierDefinition = toolDefinition.tiers[toolStatus.tier] as ToolTier;

    return getValueByLevel(toolStatus.level, tierDefinition.bonus[bonusType]);
  };

  const getSkillBonuses = useCallback(
    () =>
      tools.reduce<Partial<Record<Skills, number>>>((acc, toolType) => {
        const toolStatus = equipment.tools[toolType] || { tier: 0, level: 1 };
        const tierDef = TOOL_DEFINITIONS[toolType].tiers[toolStatus.tier] as ToolTier;
        return mergeNumericRecords(acc, resolveSkillBonuses(tierDef, toolStatus.level));
      }, {}),
    [equipment.tools],
  );

  return { equipment, getTool, getEquipmentBonus, getSkillBonuses };
};

export const useResetTraps = () => {
  const { consumables } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();

  return () => {
    if (consumables.trap) {
      mutateSpecific("consumables", {
        trap: { ...consumables.trap, current: consumables.trap.max ?? 0 },
      });
    }
  };
};
