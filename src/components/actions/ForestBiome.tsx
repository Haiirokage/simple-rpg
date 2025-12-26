import { useMutateResources, useResources } from "../../data/resources/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import {
  getBerryIncomeMultiplier,
  getFiberDropChance,
  isActionWithinDaylight,
} from "../../data/time/season-util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useMutateKnowledge, useSpecificKnowledge } from "../../data/knowledge/hooks";
import {
  calculateLevelGain,
  calculateEnergyModifier,
  calculateYieldMultiplier,
} from "../../data/knowledge/util";

import { useMemo } from "preact/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { FOREST_ACTIONS } from "./definitions";
import { usePlayerStatus, useUpdatePlayerStatus } from "../../data/playerStatus/hooks";
import ActionButton from "../ActionButton";
import { getAffordability } from "../../data/resources/util";
import type { ResourceStore } from "../../data/resources/types";
import { Paragraph } from "../../style/elements";
import type { KnowledgeTier } from "../../data/knowledge/types";
import { useAttributes, useGrantExperience } from "../../data/attributes/hooks";

const ForestBiome = () => {
  const { resources } = useResources();
  const { berry, wood, stone, fiber } = resources;
  const { mutate } = useMutateResources();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { consumables, tools } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const { knowledge } = useSpecificKnowledge("forest");
  const { mutate: mutateKnowledge } = useMutateKnowledge();
  const { attributes } = useAttributes();
  const grantExperience = useGrantExperience();

  const berryIncomeMultiplier = useMemo(() => getBerryIncomeMultiplier(day), [day]);

  const fiberDropChance = useMemo(() => getFiberDropChance(day), [day]);
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();

  return (
    <div className="forest-actions">
      <Paragraph>
        Tier {knowledge.tier} (Level {knowledge.level})
      </Paragraph>
      {FOREST_ACTIONS.map((action) => {
        const { canAfford, resourceResult } = getAffordability(action.resourceCost, resources);
        const mutateResources = (resourceUpdate: Partial<ResourceStore>) => {
          mutate({ ...resourceResult, ...resourceUpdate });
        };
        const disabled =
          (action.id === "setTrap" && consumables.trap.count <= consumables.trap.active) ||
          !isActionWithinDaylight(time, action.timeCost, day);

        const energyModifier = calculateEnergyModifier(action.complexity || 0, knowledge);
        const energyCost = action.energyCost + energyModifier;

        const yieldMultiplier = calculateYieldMultiplier(action.complexity, knowledge);

        return !(action.id === "setTrap" && consumables.trap.count === 0) ? (
          <ActionButton
            key={action.id}
            energyModifier={energyModifier}
            action={action}
            disabled={playerStatus.energy < energyCost || !canAfford || disabled}
            onClick={() => {
              switch (action.id) {
                case "forage": {
                  const forageYield = Math.round(
                    20 * berryIncomeMultiplier * yieldMultiplier * Math.random(),
                  );

                  mutateResources({ berry: berry + forageYield });
                  break;
                }
                case "gatherWood": {
                  const hatchetDef = TOOL_DEFINITIONS.find((t) => t.key === "hatchet");
                  const tierDef = hatchetDef?.tiers[tools.hatchet.level];
                  const woodBonus = tierDef?.bonus.woodGathering ?? 1;
                  const fiberDropped =
                    Math.random() < fiberDropChance * woodBonus * yieldMultiplier ? 1 : 0;
                  mutateResources({
                    wood: wood + woodBonus,
                    fiber: fiber + fiberDropped,
                  });
                  break;
                }
                case "gatherStone": {
                  const stoneYield = (attributes.strength.level - 10) / 20;
                  const guaranteed = Math.floor(stoneYield);
                  const sum = guaranteed + (Math.random() < stoneYield % 1 ? 1 : 0);
                  if (sum > 0) {
                    mutateResources({ stone: stone + sum });
                    grantExperience("strength", sum * 3500);
                  }
                  break;
                }
                case "setTrap": {
                  mutateResources({});
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
              const newLevel = knowledge.level + calculateLevelGain(action.complexity, knowledge);

              mutateKnowledge({
                forest: {
                  level: newLevel % 100,
                  tier: Math.min(knowledge.tier + Math.floor(newLevel / 100), 3) as KnowledgeTier,
                },
              });

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
    </div>
  );
};

export default ForestBiome;
