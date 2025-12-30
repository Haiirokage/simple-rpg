import { useCallback } from "preact/hooks";
import { useTime } from "../../data/time/hooks";
import { useDiscoveries } from "../../data/discoveries/hooks";
import type { ActionId } from "./action-definitions";
import { getSeasonByDay } from "../../data/time/season-util";
import type { ResourceStore } from "../../data/resources/types";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { useEquipment } from "../../data/equipment/hooks";

/**
 * Hook that returns action-specific multiplier functions.
 * Each function combines all relevant factors (seasonal, knowledge, discoveries, etc.)
 * into a single multiplier value.
 */
export const useActionMultipliers = () => {
  const { day } = useTime();
  const discoveries = useDiscoveries();
  const { yieldMultiplier } = getSeasonByDay(day);
  const { tools } = useEquipment();

  const forage = useCallback(() => {
    const seasonalMultiplier = yieldMultiplier.forage || 1;
    const discoveryBonus = 1 + discoveries.berry_patch * 0.05;
    return { berry: seasonalMultiplier * discoveryBonus * Math.random() };
  }, [yieldMultiplier.forage, discoveries.berry_patch]);

  const gatherWood = useCallback(() => {
    const hatchetDef = TOOL_DEFINITIONS.find((t) => t.key === "hatchet");
    const tierDef = hatchetDef?.tiers[tools.hatchet.level];
    const woodBonus = tierDef?.bonus.woodGathering ?? 1;
    return { fiber: yieldMultiplier.gatherWood * woodBonus, wood: woodBonus };
  }, [yieldMultiplier.gatherWood, tools.hatchet.level]);

  return {
    forage,
    gatherWood,
  } as Record<ActionId, () => Partial<ResourceStore>>;
};
