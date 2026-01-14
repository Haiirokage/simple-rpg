import { useHandlePlayerStatus } from "./playerStatus/hooks";

export type PlayerEffect = "nausea";

export const useHandleEffect = () => {
  const { updatePlayerStatus } = useHandlePlayerStatus();

  return (effect: PlayerEffect) => {
    switch (effect) {
      case "nausea":
        updatePlayerStatus({
          satiation: -50,
          energy: -20,
          health: -10,
        });
        //reduce satiation
        return;
      default:
        return;
    }
  };
};
