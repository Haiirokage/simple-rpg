import { useHandlePlayerStatus } from "./playerStatus/hooks";

export type PlayerEffect = "nausea";

export const useHandleEffect = () => {
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();

  return (effect: PlayerEffect) => {
    switch (effect) {
      case "nausea":
        updatePlayerStatus({
          satiation: Math.max(0, playerStatus.satiation - 50),
          energy: Math.max(0, playerStatus.energy - 20),
          health: Math.max(0, playerStatus.health - 10),
        });
        //reduce satiation
        return;
      default:
        return;
    }
  };
};
