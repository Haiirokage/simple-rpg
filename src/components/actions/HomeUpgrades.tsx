import { useMutateResources, useResources } from "../../data/resources/hooks";
import {
  getAffordability,
  formatResourceCost,
  hasDiscoveredResources,
} from "../../data/resources/util";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { useHomeUpgrades, useUpdateHomeUpgrades } from "../../data/homeUpgrades/hooks";
import { HOME_UPGRADES, type HomeUpgradeDefinition } from "../../data/homeUpgrades/definitions";
import type { ResourceStore } from "../../data/resources/types";
import { usePlayerStatus, useUpdatePlayerStatus } from "../../data/playerStatus/hooks";
import { getSeasonByDay } from "../../data/time/season-util";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { useMemo } from "preact/hooks";
import { Button } from "../../style/elements";
import { objectEntries } from "../../util";

const HomeUpgrades = () => {
  const { resources } = useResources();
  const { mutate } = useMutateResources();
  const updateTime = useUpdateTime();
  const { time, day } = useTime();
  const { data: homeUpgrades } = useHomeUpgrades();
  const updateHomeUpgrades = useUpdateHomeUpgrades();
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const discoveries = useDiscoveries();

  const discoveredUpgrades = useMemo(() => {
    return HOME_UPGRADES.filter((upgrade) => {
      // Show upgrade if no discoveries required, or if all required discoveries are met
      if (!upgrade.discoveriesRequired) return true;
      const hasDiscovered = hasDiscoveredResources(upgrade.resourceCost, resources);
      if (!hasDiscovered) return false;
      return objectEntries(upgrade.discoveriesRequired).every(
        ([discoveryType, required]) => discoveries[discoveryType] >= required,
      );
    });
  }, [discoveries, resources]);

  const buildUpgrade = (upgrade: HomeUpgradeDefinition, resourceResult: Partial<ResourceStore>) => {
    if (homeUpgrades[upgrade.key]) return; // Already built

    mutate(resourceResult);
    updateTime({ time: time + upgrade.timeCost });
    updateHomeUpgrades({ [upgrade.key]: true });
  };

  return (
    <div>
      <Button
        onClick={() => {
          const nextDay = day + 1;
          const month = getSeasonByDay(nextDay);
          const wakeupTime = 24 + month.sunrise;
          updatePlayerStatus({
            energy: Math.floor(
              playerStatus.energy + 0.06 * (wakeupTime - time) * playerStatus.satiation,
            ),
          });
          updateTime({ time: wakeupTime });
        }}
      >
        Rest
      </Button>
      {discoveredUpgrades.map((upgrade) => {
        const isBuilt = homeUpgrades[upgrade.key];
        const { canAfford, resourceResult } = getAffordability(upgrade.resourceCost, resources);
        const isDisabled = isBuilt || !canAfford;

        return (
          <Button
            key={upgrade.key}
            disabled={isDisabled}
            onClick={() => buildUpgrade(upgrade, resourceResult)}
          >
            {upgrade.name}
            {isBuilt ? " (✓)" : ""} - Costs: {formatResourceCost(upgrade.resourceCost)}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeUpgrades;
