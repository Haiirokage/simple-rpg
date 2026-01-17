import { useHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { usePlayerStatus, useUpdatePlayerStatus } from "../../data/playerStatus/hooks";
import { useGrantExperience, usePlayerForce } from "../../data/attributes/hooks";
import ActionButton from "../ActionButton";
import { useHandleAttack } from "../../combat/hooks";
import { getBasicNPC } from "../../data/encounters/util";
import { useState } from "preact/hooks";
import { objectKeys } from "../../util";
import { getDistanceMultiplier } from "../../combat/util";

const trainStrengthAction = {
  timeCost: 1,
  energyCost: 30,
};
const trainRangedAction = {
  timeCost: 1,
  energyCost: 20,
};

const targets = {
  100: getBasicNPC("archeryTarget", 100),
  120: getBasicNPC("archeryTarget", 120),
  150: getBasicNPC("archeryTarget", 150),
};

const HomeActions = () => {
  const [rangeTarget, setRangeTarget] = useState("100");
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

  const trainRanged = () => {
    const { timeCost, energyCost } = trainRangedAction;

    // Consume energy
    updatePlayerStatus({
      energy: -energyCost,
    });
    const result = handleAttack(targets[rangeTarget as "100" | "120" | "150"], "body");

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
        <>
          <ActionButton
            action={{ ...trainRangedAction, name: "Train Archery" }}
            disabled={playerStatus.energy < trainRangedAction.energyCost}
            onClick={trainRanged}
          />
          <label for="range-select">Range</label>
          <select
            id="range-select"
            value={rangeTarget}
            onChange={(e) => {
              if (e.target) {
                setRangeTarget(e.currentTarget.value);
                console.log(e.target);
              }
            }}
          >
            {objectKeys(targets).map((distance) => (
              <option value={distance}>
                {distance} ({Math.round(getDistanceMultiplier(distance * 1) * 100)}%)
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default HomeActions;
