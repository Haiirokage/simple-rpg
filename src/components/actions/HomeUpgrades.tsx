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
import {
  usePlayerRegenRates,
  usePlayerStatus,
  useUpdatePlayerStatus,
} from "../../data/playerStatus/hooks";
import { getSeasonByDay } from "../../data/time/season-util";
import { useDiscoveries } from "../../data/discoveries/hooks";
import { useMemo } from "preact/hooks";
import { Button } from "../../style/elements";
import { meetsDiscoveryRequirements } from "../../biome/discovery-util";
import TooltipWrapper from "../../style/TooltipWrapper";

const HomeUpgrades = () => {
  const { resources } = useResources();
  const { mutate } = useMutateResources();
  const updateTime = useUpdateTime();
  const { time, day } = useTime();
  const { data: homeUpgrades } = useHomeUpgrades();
  const updateHomeUpgrades = useUpdateHomeUpgrades();
  const { data: playerStatus } = usePlayerStatus();
  const { energyRegen } = usePlayerRegenRates();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const discoveries = useDiscoveries();

  const discoveredUpgrades = useMemo(() => {
    return HOME_UPGRADES.filter(
      (upgrade) =>
        hasDiscoveredResources(upgrade.resourceCost, resources) &&
        meetsDiscoveryRequirements(upgrade.discoveriesRequired, discoveries),
    );
  }, [discoveries, resources]);

  const buildUpgrade = (upgrade: HomeUpgradeDefinition, resourceResult: Partial<ResourceStore>) => {
    if (homeUpgrades[upgrade.key]) return; // Already built

    mutate(resourceResult);
    updateTime({ time: time + upgrade.timeCost });
    updateHomeUpgrades({ [upgrade.key]: true });
  };

  return (
    <div>
      <TooltipWrapper description="Rest until sunrise and restore energy based on satiation. You will consume food when you pass midnight.">
        <Button
          onClick={() => {
            const nextDay = day + 1;
            const month = getSeasonByDay(nextDay);
            const wakeupTime = 24 + month.sunrise;
            updatePlayerStatus({
              energy: Math.floor(energyRegen * (wakeupTime - time) * playerStatus.satiation),
            });
            updateTime({ time: wakeupTime });
          }}
        >
          Rest
        </Button>
      </TooltipWrapper>
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
