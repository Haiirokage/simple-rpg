import { useHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { useGrantExperience, usePlayerForce } from "../../data/attributes/hooks";
import ActionButton from "../ActionButton";
import { useHandleAttack } from "../../combat/hooks";
import { getBasicNPC } from "../../data/encounters/util";
import { useState } from "preact/hooks";
import { objectKeys } from "../../util";
import { getDistanceMultiplier } from "../../combat/util";
import { useHandleEquipment } from "../../data/equipment/hooks";

const trainStrengthCost = {
  time: 1,
  energy: 30,
};
const trainRangedCost = {
  time: 2,
  energy: 15,
};

const targets = {
  50: getBasicNPC("archeryTarget", 50),
  100: getBasicNPC("archeryTarget", 100),
  150: getBasicNPC("archeryTarget", 150),
};

const HomeActions = () => {
  const { getEquipmentBonus } = useHandleEquipment();
  const [rangeTarget, setRangeTarget] = useState("100");
  const { data: homeUpgrades } = useHomeUpgrades();
  const { time } = useTime();
  const updateTime = useUpdateTime();
  const grantExperience = useGrantExperience();
  const playerForce = usePlayerForce();
  const handleAttack = useHandleAttack();

  const hasStoneGym = homeUpgrades.stoneGym;
  const hasArcheryTarget = homeUpgrades.archery_target;

  const bowRange = getEquipmentBonus("bow", "range");

  const trainStrength = () => {
    const expGain = 10 * playerForce * trainStrengthCost.energy;

    // Grant strength experience
    grantExperience({ strength: expGain, constitution: expGain / 5 });

    // Advance time
    updateTime({ time: time + trainStrengthCost.time });
  };

  const trainRanged = () => {
    const result = handleAttack(targets[rangeTarget as "50" | "100" | "150"], "body");

    // Advance time
    updateTime({ time: time + trainRangedCost.time });

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
        <ActionButton name="Train Strength" cost={trainStrengthCost} onClick={trainStrength} />
      )}
      {hasArcheryTarget && (
        <>
          <ActionButton name="Train Archery" cost={trainRangedCost} onClick={trainRanged} />
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
                {distance} ({Math.round(getDistanceMultiplier(distance * 1, bowRange) * 100)}%)
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default HomeActions;
