import { useHandleResources, useResources } from "../../data/resources/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { isActionWithinDaylight } from "../../data/time/season-util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useHandleKnowledge } from "../../data/knowledge/hooks";

import { useMemo } from "preact/hooks";
import { FOREST_ACTIONS } from "../../biome/forest/action-definitions";
import { usePlayerStatus, useUpdatePlayerStatus } from "../../data/playerStatus/hooks";
import { useDiscoveries } from "../../data/discoveries/hooks";
import ActionButton from "../ActionButton";
import { getAffordability } from "../../data/resources/util";
import type { ResourceStore } from "../../data/resources/types";
import { Paragraph } from "../../style/elements";
import { useGrantExperience } from "../../data/attributes/hooks";
import { objectEntries } from "../../util";
import { useActionMultipliers } from "../../biome/forest/action-utils";
import { sum } from "lodash";

const ForestBiome = () => {
  const { resources } = useResources();

  const { addResources } = useHandleResources();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { consumables } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const { knowledge, gainLevels } = useHandleKnowledge("forest");
  const expGain = 1 / Math.pow(20, knowledge.tier);
  const energyModifier = knowledge.tier >= 2 ? -1 : 0;
  const multipliers = useActionMultipliers();
  const grantExperience = useGrantExperience();

  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const discoveries = useDiscoveries();

  const discoveredActions = useMemo(
    () =>
      Object.values(FOREST_ACTIONS).filter(
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

      {/* New refactored actions */}
      {discoveredActions.map((action) => {
        const { id, name, cost, resourceYield, experienceGrant } = action;
        const multiplier = multipliers[id]();
        const energyCost = cost.energy + energyModifier;
        const { canAfford, resourceResult } = getAffordability(cost.resources, resources);

        const disabled = !isActionWithinDaylight(time, cost.time, day);

        const resourceYieldDiff = resourceYield
          ? objectEntries(resourceYield).reduce((acc, [key, yieldDef]) => {
              const adjustedYield = yieldDef * (multiplier[key] ?? 1);
              return {
                ...acc,
                [key]: adjustedYield,
              };
            }, resourceResult as Partial<ResourceStore>)
          : resourceResult;
        const resourceAmount = sum(Object.values(resourceYieldDiff || {}).filter((v) => v > 0));

        return (
          <ActionButton
            key={id}
            action={{
              name,
              timeCost: cost.time,
              energyCost,
              resourceCost: cost.resources,
            }}
            disabled={playerStatus.energy < energyCost || !canAfford || disabled}
            onClick={() => {
              addResources(resourceYieldDiff);
              // Small knowledge bonus: 1 level per action
              gainLevels(expGain);

              if (experienceGrant && resourceAmount > 0) {
                const scaledExperienceGrant = objectEntries(experienceGrant).reduce(
                  (acc, [key, value]) => {
                    return {
                      ...acc,
                      [key]: value * resourceAmount,
                    };
                  },
                  {},
                );
                grantExperience(scaledExperienceGrant);
              }

              updateTime({ time: time + action.cost.time });
              updatePlayerStatus({
                energy: Math.max(0, playerStatus.energy - energyCost),
              });
            }}
          />
        );
      })}

      {/* setTrap - unique consumable deployment action */}
      {consumables.trap.count > 0 && (
        <ActionButton
          action={{
            name: "Set trap",
            timeCost: 1,
            energyCost: 2 + energyModifier,
            resourceCost: { berry: 4 },
          }}
          disabled={
            playerStatus.energy < 2 + energyModifier ||
            consumables.trap.count <= consumables.trap.active ||
            resources.berry < 4 ||
            !isActionWithinDaylight(time, 1, day)
          }
          onClick={() => {
            addResources({ berry: -4 });
            mutateSpecific("consumables", {
              trap: {
                ...consumables.trap,
                active: consumables.trap.active + 1,
              },
            });
            gainLevels(expGain);
            updateTime({ time: time + 1 });
            updatePlayerStatus({
              energy: Math.max(0, playerStatus.energy - (2 + energyModifier)),
            });
          }}
        />
      )}
    </div>
  );
};

export default ForestBiome;
