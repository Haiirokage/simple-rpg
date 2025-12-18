import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import type { HomeUpgradesStore } from "./types";
import { defaultHomeUpgrades } from "./types";

export const useHomeUpgrades = () => {
  return useQuery({
    queryKey: ["HOME_UPGRADES"],
    queryFn: () =>
      getStorage<HomeUpgradesStore>("HOME_UPGRADES", defaultHomeUpgrades),
    initialData: defaultHomeUpgrades,
  });
};

export const useUpdateHomeUpgrades = () => {
  const { data } = useHomeUpgrades();
  const { mutate } = useMutation<void, Error, Partial<HomeUpgradesStore>>({
    mutationFn: async (updates) => {
      const merged = { ...data, ...updates };
      return setStorage("HOME_UPGRADES", merged);
    },
    onMutate: (updates, context) => {
      context.client.setQueryData(["HOME_UPGRADES"], {
        ...data,
        ...updates,
      });
    },
  });
  return mutate;
};
