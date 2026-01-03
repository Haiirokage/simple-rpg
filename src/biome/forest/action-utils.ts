import { useCallback } from "preact/hooks";
import { useTime } from "../../data/time/hooks";
import { useDiscoveries } from "../../data/discoveries/hooks";
import type { ActionId } from "./action-definitions";
import { getSeasonByDay } from "../../data/time/season-util";
import type { ResourceStore } from "../../data/resources/types";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { useEquipment } from "../../data/equipment/hooks";
import { usePlayerForce } from "../../data/attributes/hooks";

/**
 * Hook that returns action-specific multiplier functions.
 * Each function combines all relevant factors (seasonal, knowledge, discoveries, etc.)
 * into a single multiplier value.
 */
export const useActionMultipliers = (): Record<ActionId, () => Partial<ResourceStore>> => {
  const { day } = useTime();
  const discoveries = useDiscoveries();
  const { yieldMultiplier } = getSeasonByDay(day);
  const { tools } = useEquipment();
  const playerForce = usePlayerForce();

  const forage = useCallback(() => {
    const seasonalMultiplier = yieldMultiplier.forage;
    const discoveryBonus = 1 + discoveries.berry_patch * 0.5;
    return { berry: seasonalMultiplier * discoveryBonus * Math.random() };
  }, [yieldMultiplier.forage, discoveries.berry_patch]);

  const gatherWood = useCallback(() => {
    const hatchetDef = TOOL_DEFINITIONS.find((t) => t.key === "hatchet");
    const tierDef = hatchetDef?.tiers[tools.hatchet.level];
    const woodBonus = tierDef?.bonus.woodGathering ?? 1;
    const fiberBonus = 1 + discoveries.willow_grove * 0.5;

    return { fiber: yieldMultiplier.gatherWood * woodBonus * fiberBonus, wood: woodBonus };
  }, [yieldMultiplier.gatherWood, tools.hatchet.level, discoveries.willow_grove]);

  const gatherStone = useCallback(() => {
    const strengthMult = playerForce / 50;
    return { stone: strengthMult };
  }, [playerForce]);

  return {
    forage,
    gatherWood,
    gatherStone,
  };
};
