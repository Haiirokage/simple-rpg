import { useHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { usePlayerStatus, useUpdatePlayerStatus } from "../../data/playerStatus/hooks";
import { useGrantExperience, usePlayerForce } from "../../data/attributes/hooks";
import ActionButton from "../ActionButton";
import { useHandleAttack } from "../../combat/hooks";
import { getBasicNPC } from "../../data/encounters/util";

const trainStrengthAction = {
  timeCost: 1,
  energyCost: 30,
};
const trainRangedAction = {
  timeCost: 1,
  energyCost: 20,
};

const HomeActions = () => {
  const { data: homeUpgrades } = useHomeUpgrades();
  const { time } = useTime();
  const updateTime = useUpdateTime();
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const grantExperience = useGrantExperience();
  const playerForce = usePlayerForce();
  const handleAttack = useHandleAttack();

  const hasStoneGym = homeUpgrades.stoneGym;
  const hasArcheryTarget = homeUpgrades.archery_target;

  const trainStrength = () => {
    const { timeCost, energyCost } = trainStrengthAction;

    // Consume energy
    updatePlayerStatus({
      energy: -energyCost,
    });

    const expGain = 10 * playerForce * energyCost;

    // Grant strength experience
    grantExperience({ strength: expGain, constitution: expGain / 5 });

    // Advance time
    updateTime({ time: time + timeCost });
  };

  const target = getBasicNPC("archeryTarget", 140);
  const trainRanged = () => {
    const { timeCost, energyCost } = trainRangedAction;

    // Consume energy
    updatePlayerStatus({
      energy: -energyCost,
    });
    const result = handleAttack(target, "body");

    // Advance time
    updateTime({ time: time + timeCost });

    if (result === "failure") {
      return;
    }

    const { healthLost, hitSeverity } = result;
    if (hitSeverity === "miss") {
      console.info("Missed training shot, no experience gained.");
      return;
    } else {
      if (healthLost === 0) {
        console.info(
          "You hit the target, but your bow is not powerful enough to penetrate at this range.",
        );
        return;
      } else {
        console.info(`Hit the target dealing ${healthLost} damage.`);
      }
    }
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
      {hasArcheryTarget && (
        <ActionButton
          action={{ ...trainRangedAction, name: "Train Archery" }}
          disabled={playerStatus.energy < trainRangedAction.energyCost}
          onClick={trainRanged}
        />
      )}
    </div>
  );
};

export default HomeActions;
