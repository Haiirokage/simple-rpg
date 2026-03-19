import { useCallback } from "preact/hooks";
import { useTime } from "../../data/time/hooks";
import { useDiscoveries } from "../../data/discoveries/hooks";
import type { ActionId } from "./action-definitions";
import { getSeasonByDay } from "../../data/time/season-util";
import type { ResourceStore } from "../../data/resources/types";
import { useHandleEquipment } from "../../data/equipment/hooks";
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
  const { getEquipmentBonus } = useHandleEquipment();
  const playerForce = usePlayerForce();

  const forage = useCallback(() => {
    const seasonalMultiplier = yieldMultiplier.forage;
    const discoveryBonus = 1 + discoveries.berry_patch * 0.5;
    return { berry: seasonalMultiplier * discoveryBonus };
  }, [yieldMultiplier.forage, discoveries.berry_patch]);

  const gatherWood = useCallback(() => {
    const woodBonus = getEquipmentBonus("hatchet", "woodGathering");
    const fiberBonus = 1 + discoveries.willow_grove * 0.5;

    return {
      wood: woodBonus,
      firewood: yieldMultiplier.gatherWood * woodBonus,
      fiber: yieldMultiplier.gatherWood * woodBonus * fiberBonus,
    };
  }, [yieldMultiplier.gatherWood, getEquipmentBonus, discoveries.willow_grove]);

  const gatherStone = useCallback(() => {
    const strengthMult = playerForce / 50;
    return { stone: strengthMult };
  }, [playerForce]);

  const gatherTubers = useCallback(() => {
    const explorationBonus = getEquipmentBonus("shoes", "explorationChance");
    return { tuber: explorationBonus };
  }, [getEquipmentBonus]);

  return {
    forage,
    gatherWood,
    gatherStone,
    gatherTubers,
  };
};
