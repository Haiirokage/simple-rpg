import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorage, setStorage } from "../util";
import { defaultPlayerStatus, type PlayerStatus } from "./types";

export const getPlayerStatus = (): PlayerStatus => {
  return getStorage<PlayerStatus>("PLAYER_STATUS", defaultPlayerStatus);
};

export const setPlayerStatus = (status: PlayerStatus) => {
  setStorage("PLAYER_STATUS", status);
};

export const usePlayerStatus = () => {
  return useQuery({
    queryKey: ["PLAYER_STATUS"],
    queryFn: () => getPlayerStatus(),
    initialData: defaultPlayerStatus,
  });
};

export const useUpdatePlayerStatus = () => {
  const { data } = usePlayerStatus();

  const { mutate } = useMutation<void, Error, Partial<PlayerStatus>>({
    mutationFn: async (updates) => setPlayerStatus({ ...data, ...updates }),
    onMutate: (updates, context) => {
      context.client.setQueryData(["PLAYER_STATUS"], {
        ...data,
        ...updates,
      });
    },
  });

  return mutate;
};
