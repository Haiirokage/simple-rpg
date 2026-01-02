import { useHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { usePlayerStatus, useUpdatePlayerStatus } from "../../data/playerStatus/hooks";
import { useAttributes, useGrantExperience } from "../../data/attributes/hooks";
import ActionButton from "../ActionButton";

const trainStrengthAction = {
  timeCost: 1,
  energyCost: 30,
};

const HomeActions = () => {
  const { data: homeUpgrades } = useHomeUpgrades();
  const { time } = useTime();
  const updateTime = useUpdateTime();
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const grantExperience = useGrantExperience();
  const { attributes } = useAttributes();

  const hasStoneGym = homeUpgrades.stoneGym;

  const trainStrength = () => {
    const { timeCost, energyCost } = trainStrengthAction;

    // Consume energy
    updatePlayerStatus({
      energy: Math.max(0, playerStatus.energy - energyCost),
    });

    const expGain = 20 * attributes.strength.level * energyCost;

    // Grant strength experience
    grantExperience("strength", expGain);

    // Advance time
    updateTime({ time: time + timeCost });
  };

  return (
    <div>
      <h3>Home actions</h3>
      {hasStoneGym && (
        <ActionButton
          action={{ ...trainStrengthAction, name: "Train Strength" }}
          disabled={playerStatus.energy < trainStrengthAction.energyCost}
          onClick={trainStrength}
        />
      )}
    </div>
  );
};

export default HomeActions;
