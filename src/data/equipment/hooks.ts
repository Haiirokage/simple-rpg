import { useCallback } from "preact/hooks";
import { mergeNumericRecords, objectEntries } from "../../util";
import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import {
  TOOL_DEFINITIONS,
  WEAPON_DEFINITIONS,
  type MeleeWeaponStats,
  type ProjectileWeaponStats,
  type ToolBonusKeys,
  type ToolTier,
} from "./definitions";
import type { WeaponType } from "./types";
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

  const getWeaponStats = (
    weaponType: WeaponType,
  ): ProjectileWeaponStats | MeleeWeaponStats | undefined => {
    const toolStatus = equipment.tools[weaponType] || { tier: 0, level: 1 };
    const def = WEAPON_DEFINITIONS[weaponType];
    if (!def.tiers[toolStatus.tier]) return undefined;
    if (def.class === "projectile") {
      const rawTier = def.tiers[toolStatus.tier];
      return {
        ...def,
        tier: {
          name: rawTier.name,
          range: getValueByLevel(toolStatus.level, rawTier.range),
          strengthRequired: rawTier.strengthRequired,
        },
      };
    }

    const rawTier = def.tiers[toolStatus.tier];
    return {
      ...def,
      tier: { name: rawTier.name, hardness: getValueByLevel(toolStatus.level, rawTier.hardness) },
    };
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

  return { equipment, getTool, getWeaponStats, getSkillBonuses };
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
