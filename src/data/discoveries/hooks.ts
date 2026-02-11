import { useCallback } from "preact/hooks";
import { useDataQuery, useUpdateData } from "../util";
import type { DiscoveriesStore } from "./types";
import { defaultDiscoveriesStore } from "./types";
import type { AllUnlockables, UnlockableDiscoveryDefinition } from "../../biome/discovery-types";

export const useDiscoveries = () => {
  const { data } = useDataQuery<DiscoveriesStore>("DISCOVERIES", defaultDiscoveriesStore);
  return data;
};

export const useMutateDiscoveries = () => {
  const { mutate } = useUpdateData<DiscoveriesStore>("DISCOVERIES", defaultDiscoveriesStore);
  return mutate;
};

export const useHandleDiscoveries = () => {
  const discoveries = useDiscoveries();
  const mutate = useMutateDiscoveries();

  const updateDiscovery = useCallback(
    (key: AllUnlockables, diff = 1) => {
      mutate({ [key]: discoveries[key] + diff });
    },
    [discoveries, mutate],
  );

  return { updateDiscovery, discoveries };
};

export const calculateDiscoveryChance = (
  currentKnowledge: number,
  definition: UnlockableDiscoveryDefinition,
  discovered: number,
  steepness: number = 0.16,
): number => {
  // expectedKnowledge increases as you find more
  // maxCount items spread across range means (maxCount - 1) intervals
  const knowledgePerDiscovery =
    definition.maxCount > 1
      ? (definition.discoveryRange.max - definition.discoveryRange.min) / (definition.maxCount - 1)
      : 0;
  const expectedKnowledge = definition.discoveryRange.min + discovered * knowledgePerDiscovery;

  // Sigmoid centered at expectedKnowledge
  // At expected: chance = rarity
  // At expected + 25: approaches 2 * rarity (capped at 1.0)
  // At expected - 25: approaches rarity / 50
  const diff = currentKnowledge - expectedKnowledge;
  const chance = (definition.rarity * 2) / (1 + Math.exp(-steepness * diff));

  return Math.min(Math.max(chance, 0), 1); // Clamp to 0-1
};
