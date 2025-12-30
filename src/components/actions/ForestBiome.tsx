import { useHandleResources, useResources } from "../../data/resources/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { isActionWithinDaylight } from "../../data/time/season-util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useHandleKnowledge } from "../../data/knowledge/hooks";
import { calculateLevelGain, calculateEnergyModifier } from "../../data/knowledge/util";

import { useMemo } from "preact/hooks";
import { FOREST_ACTIONS } from "./definitions";
import { FOREST_ACTIONS as NEW_FOREST_ACTIONS } from "../../biome/forest/action-definitions";
import { usePlayerStatus, useUpdatePlayerStatus } from "../../data/playerStatus/hooks";
import { useDiscoveries } from "../../data/discoveries/hooks";
import ActionButton from "../ActionButton";
import { getAffordability } from "../../data/resources/util";
import type { ResourceStore } from "../../data/resources/types";
import { Paragraph } from "../../style/elements";
import { useAttributes, useGrantExperience } from "../../data/attributes/hooks";
import { objectEntries } from "../../util";
import { useActionMultipliers } from "../../biome/forest/action-utils";

const ForestBiome = () => {
  const { resources } = useResources();

  const { stone } = resources;
  const { mutateResources, addResources } = useHandleResources();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { consumables } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const { knowledge, gainLevels } = useHandleKnowledge("forest");
  const { attributes } = useAttributes();
  const multipliers = useActionMultipliers();
  const grantExperience = useGrantExperience();

  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const discoveries = useDiscoveries();

  const discoveredActions = useMemo(
    () =>
      Object.values(NEW_FOREST_ACTIONS).filter(
        (action) =>
          !action.discoveriesRequired ||
          Object.entries(action.discoveriesRequired).every(
            ([discoveryType, required]) => discoveries[discoveryType as never] >= required,
          ),
      ),
    [discoveries],
  );

  return (
    <div className="forest-actions">
      <Paragraph>
        Tier {knowledge.tier} (Level {knowledge.level})
      </Paragraph>
      {FOREST_ACTIONS.map((action) => {
        const { canAfford, resourceResult } = getAffordability(action.resourceCost, resources);
        const mergeResources = (resourceUpdate: Partial<ResourceStore>) => {
          mutateResources({ ...resourceResult, ...resourceUpdate });
        };
        const disabled =
          (action.id === "setTrap" && consumables.trap.count <= consumables.trap.active) ||
          !isActionWithinDaylight(time, action.timeCost, day);

        const energyModifier = calculateEnergyModifier(action.complexity || 0, knowledge);
        const energyCost = action.energyCost + energyModifier;

        return !(action.id === "setTrap" && consumables.trap.count === 0) ? (
          <ActionButton
            key={action.id}
            energyModifier={energyModifier}
            action={action}
            disabled={playerStatus.energy < energyCost || !canAfford || disabled}
            onClick={() => {
              switch (action.id) {
                case "gatherStone": {
                  const stoneYield = (attributes.strength.level - 10) / 20;
                  const guaranteed = Math.floor(stoneYield);
                  const sum = guaranteed + (Math.random() < stoneYield % 1 ? 1 : 0);
                  if (sum > 0) {
                    mergeResources({ stone: stone + sum });
                    grantExperience("strength", sum * 3500);
                  }
                  break;
                }
                case "setTrap": {
                  mergeResources({});
                  mutateSpecific("consumables", {
                    trap: {
                      ...consumables.trap,
                      active: consumables.trap.active + 1,
                    },
                  });
                  break;
                }
              }
              // Calculate and apply level gain
              gainLevels(calculateLevelGain(action.complexity, knowledge));

              updateTime({ time: time + action.timeCost });
              updatePlayerStatus({
                energy: Math.max(0, playerStatus.energy - energyCost),
              });
            }}
          />
        ) : (
          ""
        );
      })}

      {/* New refactored actions - migrate old ones here one at a time */}
      {discoveredActions.map((action) => {
        const { id, name, cost, resourceYield } = action;
        const multiplier = multipliers[id]();
        const energyModifier = knowledge.tier >= 2 ? -1 : 0;
        const energyCost = cost.energy + energyModifier;
        const { canAfford, resourceResult } = getAffordability(cost.resources, resources);

        const disabled = !isActionWithinDaylight(time, cost.time, day);

        const resourceYieldDiff = resourceYield
          ? objectEntries(resourceYield).reduce((acc, [key, yieldDef]) => {
              const adjustedYield = yieldDef * (multiplier[key] || 1);
              return {
                ...acc,
                [key]: adjustedYield,
              };
            }, resourceResult as Partial<ResourceStore>)
          : resourceResult;

        return (
          <ActionButton
            key={id}
            action={{
              id,
              name,
              timeCost: cost.time,
              energyCost: cost.energy,
            }}
            disabled={playerStatus.energy < energyCost || !canAfford || disabled}
            onClick={() => {
              addResources(resourceYieldDiff);

              // Small knowledge bonus: 1 level per action
              gainLevels(1);

              updateTime({ time: time + action.cost.time });
              updatePlayerStatus({
                energy: Math.max(0, playerStatus.energy - energyCost),
              });
            }}
          />
        );
      })}
    </div>
  );
};

export default ForestBiome;
