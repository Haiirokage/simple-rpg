import { useMutateResources, useResources } from "../../data/resources/hooks";
import {
  getAffordability,
  formatResourceCost,
} from "../../data/resources/util";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import {
  useHomeUpgrades,
  useUpdateHomeUpgrades,
} from "../../data/homeUpgrades/hooks";
import {
  HOME_UPGRADES,
  type HomeUpgradeDefinition,
} from "../../data/homeUpgrades/definitions";
import type { ResourceStore } from "../../data/resources/types";
import {
  usePlayerStatus,
  useUpdatePlayerStatus,
} from "../../data/playerStatus/hooks";
import { getSeasonByDay } from "../../data/time/season-util";

const HomeUpgrades = () => {
  const { resources } = useResources();
  const { mutate } = useMutateResources();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { data: homeUpgrades } = useHomeUpgrades();
  const updateHomeUpgrades = useUpdateHomeUpgrades();
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();

  const buildUpgrade = (
    upgrade: HomeUpgradeDefinition,
    resourceResult: Partial<ResourceStore>,
  ) => {
    if (homeUpgrades[upgrade.key]) return; // Already built

    mutate(resourceResult);
    updateTime({ time: time + upgrade.timeCost });
    updateHomeUpgrades({ [upgrade.key]: true });
  };

  return (
    <div className="home-upgrades-actions">
      <button
        onClick={() => {
          const month = getSeasonByDay(day);
          const wakeupTime = 24 + month.sunrise;
          updatePlayerStatus({
            energy: playerStatus.energy + 5 * (wakeupTime - time),
          });
          updateTime({ time: wakeupTime });
        }}
      >
        Rest
      </button>
      {HOME_UPGRADES.map((upgrade) => {
        const isBuilt = homeUpgrades[upgrade.key];
        const { canAfford, resourceResult } = getAffordability(
          upgrade.resourceCost,
          resources,
        );
        const isDisabled = isBuilt || !canAfford;

        return (
          <div key={upgrade.key}>
            <button
              disabled={isDisabled}
              onClick={() => buildUpgrade(upgrade, resourceResult)}
            >
              {upgrade.name}
              {isBuilt ? " (✓)" : ""} - Costs:{" "}
              {formatResourceCost(upgrade.resourceCost)}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default HomeUpgrades;
