import { useDataQuery, useUpdateData } from "../util";
import type { HomeUpgradesStore } from "./types";
import { defaultHomeUpgrades } from "./types";

export const useHomeUpgrades = () => {
  return useDataQuery<HomeUpgradesStore>("HOME_UPGRADES", defaultHomeUpgrades);
};

export const useUpdateHomeUpgrades = () => {
  const { mutate } = useUpdateData<HomeUpgradesStore>("HOME_UPGRADES", defaultHomeUpgrades);
  return mutate;
};
