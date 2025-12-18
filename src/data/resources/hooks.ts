import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import { useStructures } from "../structures/hooks";
import { useTime } from "../time/hooks";
import {
  getWoodCostPerDay,
  getRabbitCatchLikelihood,
} from "../time/season-util";
import {
  getStorageCapacity,
  FOOD_STORAGE,
  NUTRITION_TYPES,
} from "./food-definitions";
import { defaultResourceStore, type ResourceStore } from "./types";
import { objectEntries } from "../../util";
import { useCallback, useMemo } from "preact/hooks";
import { useEquipment, useResetTraps } from "../equipment/hooks";
import { applyResourceDecay } from "./consumption";
import { usePlayerStatus, useUpdatePlayerStatus } from "../playerStatus/hooks";
import { updateSatiationFromFood } from "../playerStatus/util";
import pickBy from "lodash/pickBy";

/**
 * Check if all required resources have been discovered (exist in persisted state)
 */
export const hasDiscoveredResources = (
  requiredResources: Partial<ResourceStore>,
  persistedResources: Partial<ResourceStore>,
): boolean => {
  return objectEntries(requiredResources).every(
    ([key]) => key in persistedResources,
  );
};

/**
 * TODO: Add resource discoverability tracking
 * - Store set of resources the player has ever had > 0
 * - Use this to gate craft/build buttons visibility
 * - Buildings and equipment shouldn't show until all required materials are discovered
 */
export const useResources = () => {
  const defaultedResourceStore = useMemo(
    () => pickBy(defaultResourceStore, (value) => value > 0),
    [],
  );
  const { data, refetch } = useQuery({
    queryKey: ["RESOURCES"],
    queryFn: () =>
      getStorage<Partial<ResourceStore>>("RESOURCES", defaultedResourceStore),
    initialData: defaultedResourceStore,
  });
  return {
    resources: { ...defaultResourceStore, ...data },
    data: data as Partial<ResourceStore>,
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
            [key]: Math.min(value, getStorageCapacity(key, structures.pantry)),
          };
        }, data);
    },
    [data, structures],
  );

  return useMutation<void, Error, Partial<ResourceStore>>({
    mutationFn: async (resources) => {
      // Apply mutation and enforce storage capacities
      const merged = mergeData(resources);
      return setStorage("RESOURCES", merged);
    },
    onMutate: (resources, context) => {
      // Optimistically cap resources on the client as well
      const merged = mergeData(resources);
      context.client.setQueryData(["RESOURCES"], merged);
    },
  });
};

/**
 * Hook that returns a function to handle daily resource consumption.
 * Call this when a new day starts to apply food and warmth costs.
 * Order: consumption → decay → trap checking (so newly caught rabbits don't decay immediately)
 */
export const useHandleNewDay = () => {
  const { resources } = useResources();
  const { mutate } = useMutateResources();
  const { day } = useTime();
  const { consumables } = useEquipment();
  const resetTraps = useResetTraps();
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const { structures } = useStructures();

  const sortedFoodDefinitions = useMemo(
    () => [...FOOD_STORAGE].sort((a, b) => b.decayRate - a.decayRate),
    [],
  );

  return () => {
    const woodConsumption = getWoodCostPerDay(day);

    // Pick foods to consume: one from each nutrition type
    const consumedFood = NUTRITION_TYPES.map((nutritionType) => {
      return sortedFoodDefinitions.find(
        (food) =>
          food.nutritionType === nutritionType &&
          resources[food.key] >= (food.mealSize ?? 0),
      );
    }).filter((food) => food !== undefined);

    // Update player satiation based on food consumption
    const { satiation, maxSatiation } = updateSatiationFromFood(
      playerStatus.satiation,
      playerStatus.maxSatiation,
      consumedFood.length,
    );
    updatePlayerStatus({
      satiation,
      maxSatiation,
      maxEnergy: satiation,
      energy: Math.min(playerStatus.energy, satiation),
    });

    // Consumption first

    const consumedResources = consumedFood.reduce(
      (acc, resource) => ({
        ...acc,
        [resource.key]: acc[resource.key] - (resource.mealSize ?? 0),
      }),
      { ...resources, wood: resources.wood - woodConsumption },
    );

    const decayedResources = FOOD_STORAGE.reduce(
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

    // Trap checking after decay (so newly caught rabbits don't decay immediately)
    const rabbitCatchLikelihood = getRabbitCatchLikelihood(day);

    const rabbitMeat = Array.from({
      length: consumables.trap.active,
    }).reduce(
      (caught: number) =>
        caught + (Math.random() < rabbitCatchLikelihood ? 4 : 0),
      decayedResources.rabbitMeat,
    );

    resetTraps();

    const finalResources = {
      ...decayedResources,
      rabbitMeat,
    };

    mutate(finalResources);
  };
};
