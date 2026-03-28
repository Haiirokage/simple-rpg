import { useHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { useGrantExperience, usePlayerForce } from "../../data/attributes/hooks";
import ActionButton from "../ActionButton";
import { useHandleAttack } from "../../combat/hooks";
import { getBasicNPC } from "../../data/encounters/util";
import { useState } from "preact/hooks";
import { objectKeys } from "../../util";
import { getDistanceMultiplier, type HitTarget } from "../../combat/util";
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
  const { getWeaponStats } = useHandleEquipment();
  const [rangeTarget, setRangeTarget] = useState("100");
  const [hitTarget, setHitTarget] = useState<HitTarget>("body");
  const { data: homeUpgrades } = useHomeUpgrades();
  const grantExperience = useGrantExperience();
  const playerForce = usePlayerForce();
  const { handleAttack } = useHandleAttack();

  const hasStoneGym = homeUpgrades.stoneGym;
  const hasArcheryTarget = homeUpgrades.archery_target;

  const bowStats = getWeaponStats("bow");
  const bowRange = bowStats?.class === "projectile" ? (bowStats.tier?.range ?? 0) : 0;

  const trainStrength = () => {
    const expGain = playerForce * playerForce * trainStrengthCost.energy;

    // Grant strength experience
    grantExperience({ strength: expGain, constitution: expGain / 5 });
  };

  const trainRanged = () => {
    const result = handleAttack(targets[rangeTarget as "50" | "100" | "150"], hitTarget);

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
                {distance} ({100 - Math.round(getDistanceMultiplier(distance, bowRange) * 100)}%
                penalty)
              </option>
            ))}
          </select>
          <label for="target-select">Target</label>
          <select
            id="target-select"
            value={hitTarget}
            onChange={(e) => setHitTarget(e.currentTarget.value as HitTarget)}
          >
            <option value="head">Head</option>
            <option value="body">Body</option>
            <option value="legs">Legs</option>
          </select>
        </>
      )}
    </div>
  );
};

export default HomeActions;
