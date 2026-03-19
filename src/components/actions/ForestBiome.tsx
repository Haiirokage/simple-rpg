import { useHandleResources } from "../../data/resources/hooks";
import { useTime } from "../../data/time/hooks";
import { isActionWithinDaylight } from "../../data/time/season-util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useHandleKnowledge } from "../../data/knowledge/hooks";

import { useMemo } from "preact/hooks";
import { FOREST_ACTIONS } from "../../biome/forest/action-definitions";
import { useDiscoveries } from "../../data/discoveries/hooks";
import ActionButton from "../ActionButton";
import type { ResourceStore } from "../../data/resources/types";
import { Paragraph } from "../../style/elements";
import { useGrantExperience } from "../../data/attributes/hooks";
import { objectEntries } from "../../util";
import { meetsDiscoveryRequirements } from "../../biome/discovery-util";
import { useActionMultipliers } from "../../biome/forest/action-utils";
import { sum } from "lodash";
import ExploreButton from "../ExploreButton";
import TooltipWrapper from "../../style/TooltipWrapper";
import { formatResourceCost } from "../../data/resources/util";

const ForestBiome = () => {
  const { addResources } = useHandleResources();
  const { time, day } = useTime();
  const { consumables } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const { knowledge, gainLevels } = useHandleKnowledge("forest");
  const knowledgeScore = knowledge.tier * 100 + knowledge.level;
  const expGain = 1 / Math.pow(15, knowledge.tier);
  const energyModifier = knowledge.tier >= 2 ? -1 : 0;
  const multipliers = useActionMultipliers();
  const grantExperience = useGrantExperience();

  const discoveries = useDiscoveries();

  const discoveredActions = useMemo(
    () =>
      Object.values(FOREST_ACTIONS).filter((action) => {
        const hasDiscoveries = meetsDiscoveryRequirements(action.discoveriesRequired, discoveries);
        return (
          hasDiscoveries &&
          (!action.knowledgeRequired || knowledgeScore >= action.knowledgeRequired)
        );
      }),
    [discoveries, knowledgeScore],
  );
  const isDay = isActionWithinDaylight(time, 0, day);

  return (
    <div className="forest-actions">
      <Paragraph>
        Knowledge Tier {knowledge.tier} (Level {knowledge.level})
      </Paragraph>
      <TooltipWrapper
        inline
        description="Venture into the forest to discover new resources, encounters, and more."
      >
        <ExploreButton />
      </TooltipWrapper>

      {!isDay && <Paragraph>It's currently too dark to safely explore the forest.</Paragraph>}
      {/* New refactored actions */}
      {discoveredActions.map((action) => {
        const { id, name, cost, resourceYield, experienceGrant } = action;
        const multiplier = multipliers[id]();
        const energyCost = cost.energy + energyModifier;
        const disabled = !isActionWithinDaylight(time, cost.time, day);

        const yieldEntries = resourceYield
          ? objectEntries(resourceYield).reduce(
              (acc, [key, base]) => ({ ...acc, [key]: base * (multiplier[key] ?? 1) }),
              {} as Partial<ResourceStore>,
            )
          : undefined;

        return (
          <TooltipWrapper
            description={
              yieldEntries ? `Average yield: ${formatResourceCost(yieldEntries, 2)}` : undefined
            }
          >
            <ActionButton
              key={id}
              name={name}
              cost={{ ...cost, energy: energyCost }}
              disabled={disabled}
              onClick={() => {
                const roll = 0.2 + Math.cbrt(Math.random());
                const rolledYield = yieldEntries
                  ? objectEntries(yieldEntries).reduce(
                      (acc, [key, value]) => ({ ...acc, [key]: value * roll }),
                      {} as Partial<ResourceStore>,
                    )
                  : undefined;

                if (rolledYield) addResources(rolledYield);
                gainLevels(expGain);

                if (experienceGrant && rolledYield) {
                  const resourceAmount = sum(Object.values(rolledYield).filter((v) => v > 0));
                  if (resourceAmount > 0) {
                    grantExperience(
                      objectEntries(experienceGrant).reduce(
                        (acc, [key, value]) => ({
                          ...acc,
                          [key]: value * Math.pow(resourceAmount, 2.5),
                        }),
                        {},
                      ),
                    );
                  }
                }
              }}
            />
          </TooltipWrapper>
        );
      })}

      {/* setTrap - unique consumable deployment action */}
      {consumables.trap && (
        <ActionButton
          name="Set trap"
          cost={{ time: 1, energy: 2 + energyModifier, resources: { berry: 3 } }}
          disabled={consumables.trap.current <= 0 || !isActionWithinDaylight(time, 1, day)}
          onClick={() => {
            mutateSpecific("consumables", {
              trap: { ...consumables.trap!, current: consumables.trap!.current - 1 },
            });
            gainLevels(expGain);
          }}
        />
      )}
    </div>
  );
};

export default ForestBiome;
