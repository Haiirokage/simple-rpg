import { useDataQuery, useUpdateData } from "../util";
import { useStructures } from "../structures/hooks";
import { useTime } from "../time/hooks";
import { getWoodCostPerDay, getRabbitCatchLikelihood } from "../time/season-util";
import { useDiscoveries } from "../discoveries/hooks";
import { FOOD_STORAGE, NUTRITION_TYPES } from "./food-definitions";
import { defaultResourceStore, type ResourceStore } from "./types";
import { objectEntries, rollFractional } from "../../util";
import { useCallback, useMemo } from "preact/hooks";
import { useEquipment, useResetTraps } from "../equipment/hooks";
import { applyResourceDecay } from "./consumption";
import { usePlayerStatus, useUpdatePlayerStatus } from "../playerStatus/hooks";
import { updateSatiationFromFood } from "../playerStatus/util";
import pickBy from "lodash/pickBy";
import { calculateYieldMultiplier } from "../knowledge/util";
import { useKnowledge } from "../knowledge/hooks";
import { FOREST_ACTIONS } from "../../components/actions/definitions";
import { getStorageCapacity } from "./util";
import { getEndOfDayEvent } from "../../events/util";
import { useAddEventLogEntry } from "../eventLog/hooks";
import { clamp } from "lodash";

/**
 * TODO: Add resource discoverability tracking
 * - Store set of resources the player has ever had > 0
 * - Use this to gate craft/build buttons visibility
 * - Buildings and equipment shouldn't show until all required materials are discovered
 */
export const useResources = () => {
  const defaultedResourceStore: Partial<ResourceStore> = useMemo(
    () => pickBy(defaultResourceStore, (value) => value > 0),
    [],
  );
  const { data, refetch } = useDataQuery("RESOURCES", defaultedResourceStore);
  return {
    resources: { ...defaultResourceStore, ...data },
    data,
    refetch,
  };
};

export const useMutateResources = () => {
  const { data } = useResources();
  const { structures } = useStructures();

  const mergeData = useCallback(
    (newResources: Partial<ResourceStore>) => {
      return objectEntries(newResources)
        .filter(([key, value]) => value > 0 || data[key])
        .reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: clamp(value, getStorageCapacity(key, structures)),
          };
        }, data);
    },
    [data, structures],
  );

  const { mutate } = useUpdateData<Partial<ResourceStore>>("RESOURCES", data);

  // Custom mutation that applies storage capacity logic
  return {
    mutate: (resources: Partial<ResourceStore>) => {
      const merged = mergeData(resources);
      mutate(merged);
    },
  };
};

export const useHandleResources = () => {
  const { resources, data } = useResources();
  const { mutate: mutateResources } = useMutateResources();

  const addResources = useCallback(
    (resourceAdditions: Partial<ResourceStore>) => {
      const newResources = objectEntries(resourceAdditions).reduce((acc, [key, value]) => {
        const addition = rollFractional(value);
        return {
          ...acc,
          [key]: resources[key] + addition,
        };
      }, {});
      mutateResources(newResources);
    },
    [resources, mutateResources],
  );
  return { resources, data, mutateResources, addResources };
};

/**
 * Hook that returns a function to handle daily resource consumption.
 * Call this when a new day starts to apply food and warmth costs.
 * Order: consumption → decay → trap checking (so newly caught rabbits don't decay immediately)
 */
export const useHandleNewDay = () => {
  const { resources } = useResources();
  const { mutate } = useMutateResources();
  const { day, year } = useTime();
  const { consumables } = useEquipment();
  const resetTraps = useResetTraps();
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const { structures, getBerryIncome } = useStructures();
  const { knowledge } = useKnowledge();
  const discoveries = useDiscoveries();
  const addEntry = useAddEventLogEntry();

  // Check for end-of-day events (month is 0-indexed from day)

  const sortedFoodDefinitions = useMemo(
    () => [...FOOD_STORAGE].sort((a, b) => b.decayRate - a.decayRate),
    [],
  );

  return () => {
    const monthIndex = (day - 1) % 12;
    const event = getEndOfDayEvent(monthIndex);
    const berryMultiplier = event?.effects.berryMultiplier ?? 1;
    const woodMultiplier = event?.effects.woodConsumption ?? 1;

    if (event) {
      addEntry({ year, day, eventId: event.id, category: "eod" });
    }
    const woodConsumption = getWoodCostPerDay(day) * woodMultiplier;

    // Calculate health damage from insufficient wood
    const missingWood = Math.max(0, woodConsumption - resources.wood);
    const healthDamageFromCold = missingWood * 5;

    // Pick foods to consume: one from each nutrition type
    const consumedFood = NUTRITION_TYPES.map((nutritionType) => {
      return sortedFoodDefinitions.find(
        (food) =>
          food.nutritionType === nutritionType && resources[food.key] >= (food.mealSize ?? 0),
      );
    }).filter((food) => food !== undefined);

    // Update player satiation based on food consumption
    const { satiation, maxSatiation } = updateSatiationFromFood(
      playerStatus.satiation,
      playerStatus.maxSatiation,
      consumedFood.length,
    );

    // Calculate health damage from starvation (no food + satiation 0)
    const healthDamageFromStarvation = consumedFood.length === 0 && satiation === 0 ? 10 : 0;

    updatePlayerStatus({
      satiation,
      maxSatiation,
      maxEnergy: satiation,
      energy: Math.min(playerStatus.energy, satiation),
      health: Math.max(0, playerStatus.health - healthDamageFromCold - healthDamageFromStarvation),
    });

    // Log damage events
    if (healthDamageFromCold > 0) {
      addEntry({ year, day, eventId: "coldDamage", category: "system" });
    }
    if (healthDamageFromStarvation > 0) {
      addEntry({ year, day, eventId: "starvation", category: "system" });
    }

    // Consumption first

    const consumedResources = consumedFood.reduce(
      (acc, resource) => ({
        ...acc,
        [resource.key]: acc[resource.key] - (resource.mealSize ?? 0),
      }),
      { ...resources, wood: resources.wood - woodConsumption },
    );

    const decayedFood = FOOD_STORAGE.reduce(
      (acc, resource) => ({
        ...acc,
        [resource.key]: applyResourceDecay(
          resource.key,
          acc[resource.key],
          structures.pantry > 0 ? 0.01 : 0,
        ),
      }),
      consumedResources,
    );
    const materialsAfterDecay = {
      ...decayedFood,
      wood: applyResourceDecay("wood", decayedFood.wood, structures.woodShed > 0 ? 0.02 : 0),
    };

    const trapAction = FOREST_ACTIONS.find((a) => a.id === "setTrap");
    const yieldMultiplier = calculateYieldMultiplier(trapAction?.complexity, knowledge.forest);
    // Trap checking after decay (so newly caught rabbits don't decay immediately)
    // Multiply by discovered trails (each trail adds 50% bonus)
    const trailBonus = 1 + discoveries.rabbit_trail * 0.5;
    const rabbitCatchLikelihood = getRabbitCatchLikelihood(day) * yieldMultiplier * trailBonus;

    const rabbitMeat = Array.from({
      length: consumables.trap.active,
    }).reduce(
      (caught: number) => caught + (Math.random() < rabbitCatchLikelihood ? 4 : 0),
      materialsAfterDecay.rabbitMeat,
    );

    const berry = materialsAfterDecay.berry + Math.floor(getBerryIncome(day) * berryMultiplier);

    resetTraps();

    const finalResources = {
      ...materialsAfterDecay,
      berry,
      rabbitMeat,
    };

    mutate(finalResources);
  };
};
