import { useQueryClient } from "@tanstack/react-query";
import { objectEntries } from "../../util";
import { useAttributes } from "../attributes/hooks";
import { useDataQuery, useUpdateData, waitForCache } from "../util";
import { defaultPlayerStatus, type PlayerStatus } from "./types";
import { clamp } from "lodash";

export const usePlayerStatus = () => {
  return useDataQuery<PlayerStatus>("PLAYER_STATUS", defaultPlayerStatus);
};

const useMutatePlayerStatus = () => {
  const { mutate } = useUpdateData<PlayerStatus>("PLAYER_STATUS", defaultPlayerStatus);
  return mutate;
};

export const useUpdatePlayerStatus = () => {
  const queryClient = useQueryClient();
  const mutatePlayerStatus = useMutatePlayerStatus();

  return (playerStatusUpdate: Partial<Omit<PlayerStatus, "maxEnergy">>) => {
    waitForCache(queryClient, () => {
      const previousPlayerStatus =
        queryClient.getQueryData<PlayerStatus>(["PLAYER_STATUS"]) || defaultPlayerStatus;
      const updatedStatus = objectEntries(playerStatusUpdate).reduce((acc, [status, value]) => {
        return { ...acc, [status]: acc[status] + value };
      }, previousPlayerStatus);

      const adjustedSatiation = clamp(updatedStatus.satiation, updatedStatus.maxSatiation);
      const adjustedEnergy = clamp(updatedStatus.energy, adjustedSatiation);
      const adjustedHealth = clamp(updatedStatus.health, updatedStatus.maxHealth);

      const adjustedStatus = {
        ...updatedStatus,
        health: adjustedHealth,
        energy: adjustedEnergy,
        maxEnergy: adjustedSatiation,
        satiation: adjustedSatiation,
      };
      console.log("new status", playerStatusUpdate, adjustedStatus, previousPlayerStatus);
      mutatePlayerStatus(adjustedStatus);
    });
  };
};

export const useHandlePlayerStatus = () => {
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();

  return { playerStatus, updatePlayerStatus };
};

/**
 * Hook to heal the player by a certain amount.
 * Automatically handles max health capping and decimal precision (2 places).
 *
 * @returns Function that takes health points to heal and applies the healing with limits
 */
export const useHealPlayer = () => {
  const updatePlayerStatus = useUpdatePlayerStatus();

  return (healthPoints: number) => {
    const healthDiff = Math.round(healthPoints * 100) / 100;
    updatePlayerStatus({ health: healthDiff });
    return healthDiff;
  };
};

export const usePlayerRegenRates = () => {
  const { attributes } = useAttributes();

  const energyRegen = (attributes.constitution.level / 5) * 0.01;

  return { energyRegen };
};
