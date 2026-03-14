import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import { useStructures } from "../structures/hooks";
import { useTime } from "../time/hooks";
import { getFirewoodCostPerDay, getRabbitCatchLikelihood } from "../time/season-util";
import { useDiscoveries } from "../discoveries/hooks";
import { FOOD_STORAGE, NUTRITION_TYPES } from "./food-definitions";
import { defaultResourceStore, type ResourceStore } from "./types";
import { objectEntries, rollFractional } from "../../util";
import { useCallback, useMemo } from "preact/hooks";
import { useEquipment, useResetTraps, useUpdateEquipment } from "../equipment/hooks";
import { applyResourceDecay } from "./consumption";
import { usePlayerStatus, useUpdatePlayerStatus } from "../playerStatus/hooks";
import { updateSatiationFromFood } from "../playerStatus/util";
import pickBy from "lodash/pickBy";
import { getStorageCapacity } from "./util";
import { getEndOfDayEvent } from "../../events/util";
import { useAddEventLogEntry } from "../eventLog/hooks";
import { clamp } from "lodash";
import { useGrantSkillExperience, useSkills } from "../skills/hooks";
import { useGrantAcuityExp } from "../acuity/hooks";
import { useExploration } from "../exploration/hooks";

const defaultedResourceStore: Partial<ResourceStore> = pickBy(
  defaultResourceStore,
  (value) => value > 0,
);

export const resourcesQuery = makeDataQuery("RESOURCES", defaultedResourceStore);

/**
 * TODO: Add resource discoverability tracking
 * - Store set of resources the player has ever had > 0
 * - Use this to gate craft/build buttons visibility
 * - Buildings and equipment shouldn't show until all required materials are discovered
 */
export const useResources = () => {
  const { data, refetch } = useDefinedQuery(resourcesQuery);
  return {
    resources: { ...defaultResourceStore, ...data },
    data,
    refetch,
  };
};

export const useMutateResources = () => {
  const { data } = useResources();
  const { structures } = useStructures();

  const { mutate } = useUpdateData<Partial<ResourceStore>>("RESOURCES", data);

  // Custom mutation that applies storage capacity logic
  const stableMutate = useCallback(
    (newResources: Partial<ResourceStore>) => {
      const merged = objectEntries(newResources)
        .filter(([key, value]) => value > 0 || key in data)
        .reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: clamp(value, 0, getStorageCapacity(key, structures)),
          }),
          data,
        );
      mutate(merged);
    },
    [data, structures, mutate],
  );

  return { mutate: stableMutate };
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
  const { mutateSpecific: mutateEquipment } = useUpdateEquipment();
  const resetTraps = useResetTraps();
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const { structures, getBerryIncome } = useStructures();
  const discoveries = useDiscoveries();
  const addEntry = useAddEventLogEntry();
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const grantAcuityExp = useGrantAcuityExp();
  const exploration = useExploration();

  // Check for end-of-day events (month is 0-indexed from day)

  const sortedFoodDefinitions = useMemo(
    () => [...FOOD_STORAGE].sort((a, b) => b.decayRate - a.decayRate),
    [],
  );

  return () => {
    const monthIndex = (day - 1) % 12;
    const event = getEndOfDayEvent(monthIndex);
    const berryMultiplier = event?.effects.berryMultiplier ?? 1;
    const firewoodMultiplier = event?.effects.firewoodConsumption ?? 1;

    if (event) {
      addEntry({
        year,
        day,
        eventId: event.id,
        category: "eod",
        descriptionIndex: Math.floor(Math.random() * event.descriptions.length),
      });
    }

    // Check if player has lodging in current biome
    const lodging = exploration.active ? exploration.lodging[exploration.biome] : undefined;

    const firewoodConsumption = lodging ? 0 : getFirewoodCostPerDay(day) * firewoodMultiplier;

    // Calculate health damage from insufficient firewood (only when at home)
    const missingFirewood = Math.max(0, firewoodConsumption - resources.firewood);
    const healthDamageFromCold = missingFirewood * 5;

    // Pick foods to consume from player's inventory (only when not at lodging)
    const consumedFood = lodging
      ? []
      : NUTRITION_TYPES.map((nutritionType) => {
          return sortedFoodDefinitions.find(
            (food) =>
              food.nutritionType === nutritionType && resources[food.key] >= (food.mealSize ?? 0),
          );
        }).filter((food) => food !== undefined);

    // Nutrition comes from lodging or consumed food
    const mealsConsumed = lodging?.nutritionLevel ?? consumedFood.length;

    // Update player satiation based on food consumption
    const { satiation, maxSatiation } = updateSatiationFromFood(
      playerStatus.satiation,
      playerStatus.maxSatiation,
      mealsConsumed,
    );

    // Calculate health damage from starvation (no food + satiation 0)
    const healthDamageFromStarvation = mealsConsumed === 0 && satiation === 0 ? 10 : 0;

    updatePlayerStatus({
      satiation: -5 + 8 * mealsConsumed,
      maxSatiation: maxSatiation - playerStatus.maxSatiation,
      health: -healthDamageFromCold - healthDamageFromStarvation,
    });

    // Log damage events
    if (healthDamageFromCold > 0) {
      addEntry({ year, day, eventId: "coldDamage", category: "system" });
    }
    if (healthDamageFromStarvation > 0) {
      addEntry({ year, day, eventId: "starvation", category: "system" });
    }

    // Consumption (only food/wood from player's inventory when not at lodging)
    const consumedResources = consumedFood.reduce(
      (acc, resource) => ({
        ...acc,
        [resource.key]: acc[resource.key] - (resource.mealSize ?? 0),
      }),
      { ...resources, firewood: resources.firewood - firewoodConsumption },
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

    // Trap checking after decay (so newly caught rabbits don't decay immediately)
    // Multiply by discovered trails (each trail adds 75% bonus)
    // Multiply by hunting skill (each 20 levels = +0.1 bonus, so level 20 = 1.1x)
    const trailBonus = 0.5 + discoveries.rabbit_trail * 0.75;
    const huntingSkillBonus = 1 + skills.hunter.level / 10;
    const rabbitCatchLikelihood = getRabbitCatchLikelihood(day) * trailBonus * huntingSkillBonus;

    const activeTraps = consumables.trap
      ? (consumables.trap.max ?? 0) - consumables.trap.current
      : 0;
    const rabbitMeat = Array.from({
      length: activeTraps,
    }).reduce(
      (caught: number) => caught + (Math.random() < rabbitCatchLikelihood ? 4 : 0),
      materialsAfterDecay.rabbitMeat,
    );
    if (rabbitMeat > 0) {
      grantExperience({ hunter: rabbitMeat });
      grantAcuityExp("combat", rabbitMeat * 0.2);
    }

    const berry = materialsAfterDecay.berry + Math.floor(getBerryIncome(day) * berryMultiplier);

    resetTraps();

    // Lantern loses 1 charge per day as fireflies escape/die
    if (consumables.lantern && consumables.lantern.current > 0) {
      mutateEquipment("consumables", {
        lantern: { current: consumables.lantern.current - 1 },
      });
    }

    const finalResources = {
      ...materialsAfterDecay,
      berry,
      rabbitMeat,
    };

    mutate(finalResources);
  };
};
