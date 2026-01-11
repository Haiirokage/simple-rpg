import { useAttributes } from "../attributes/hooks";
import { useDataQuery, useUpdateData } from "../util";
import { defaultPlayerStatus, type PlayerStatus } from "./types";

export const usePlayerStatus = () => {
  return useDataQuery<PlayerStatus>("PLAYER_STATUS", defaultPlayerStatus);
};

export const useUpdatePlayerStatus = () => {
  const { mutate } = useUpdateData<PlayerStatus>("PLAYER_STATUS", defaultPlayerStatus);
  return mutate;
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
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();

  return (healthPoints: number) => {
    const newHealth = Math.min(
      Math.round((playerStatus.health + healthPoints) * 100) / 100,
      playerStatus.maxHealth,
    );
    updatePlayerStatus({ health: newHealth });
    return newHealth - playerStatus.health;
  };
};

export const usePlayerRegenRates = () => {
  const { attributes } = useAttributes();

  const energyRegen = (attributes.constitution.level / 5) * 0.01;

  return { energyRegen };
};
