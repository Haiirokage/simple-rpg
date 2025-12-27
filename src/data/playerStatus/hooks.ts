import { useDataQuery, useUpdateData } from "../util";
import { defaultPlayerStatus, type PlayerStatus } from "./types";

export const usePlayerStatus = () => {
  return useDataQuery<PlayerStatus>("PLAYER_STATUS", defaultPlayerStatus);
};

export const useUpdatePlayerStatus = () => {
  const { mutate } = useUpdateData<PlayerStatus>("PLAYER_STATUS", defaultPlayerStatus);
  return mutate;
};
