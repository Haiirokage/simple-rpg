import { useCallback } from "preact/hooks";
import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import type { DiscoveriesStore } from "./types";
import { defaultDiscoveriesStore } from "./types";
import type { AllUnlockables } from "../../biome/discovery-types";

export const discoveriesQuery = makeDataQuery("DISCOVERIES", defaultDiscoveriesStore);

export const useDiscoveries = () => {
  const { data } = useDefinedQuery(discoveriesQuery);
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
      mutate({ [key]: (discoveries[key] || 0) + diff });
    },
    [discoveries, mutate],
  );

  return { updateDiscovery, discoveries };
};
