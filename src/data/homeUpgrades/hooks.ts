import { makeDataQuery, useDefinedQuery, useUpdateData } from "../util";
import type { HomeUpgradesStore } from "./types";
import { defaultHomeUpgrades } from "./types";

export const homeUpgradesQuery = makeDataQuery("HOME_UPGRADES", defaultHomeUpgrades);

export const useHomeUpgrades = () => {
  return useDefinedQuery(homeUpgradesQuery);
};

export const useUpdateHomeUpgrades = () => {
  const { mutate } = useUpdateData<HomeUpgradesStore>("HOME_UPGRADES", defaultHomeUpgrades);
  return mutate;
};
