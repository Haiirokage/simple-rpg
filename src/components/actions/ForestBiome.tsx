import { useMutateResources, useResources } from "../../data/resources/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import {
  getBerryIncomeMultiplier,
  getFiberDropChance,
  isActionWithinDaylight,
} from "../../data/time/season-util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import {
  useMutateKnowledge,
  useSpecificKnowledge,
} from "../../data/knowledge/hooks";
import { calculateLevelGain } from "../../data/knowledge/util";

import { useMemo } from "preact/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { FOREST_ACTIONS } from "./definitions";
import {
  usePlayerStatus,
  useUpdatePlayerStatus,
} from "../../data/playerStatus/hooks";
import ActionButton from "../ActionButton";
import { getAffordability } from "../../data/resources/util";
import type { ResourceStore } from "../../data/resources/types";
import { Paragraph } from "../../style/elements";
import type { KnowledgeTier } from "../../data/knowledge/types";

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

  const berryIncomeMultiplier = useMemo(
    () => getBerryIncomeMultiplier(day),
    [day],
  );

  const fiberDropChance = useMemo(() => getFiberDropChance(day), [day]);
  const { data: playerStatus } = usePlayerStatus();
  const updatePlayerStatus = useUpdatePlayerStatus();

  return (
    <div className="forest-actions">
      <Paragraph>
        Tier {knowledge.tier} (Level {knowledge.level})
      </Paragraph>
      {FOREST_ACTIONS.map((action) => {
        const { canAfford, resourceResult } = getAffordability(
          action.resourceCost,
          resources,
        );
        const mutateResources = (resourceUpdate: Partial<ResourceStore>) => {
          mutate({ ...resourceResult, ...resourceUpdate });
        };
        const disabled =
          (action.id === "setTrap" &&
            consumables.trap.count <= consumables.trap.active) ||
          !isActionWithinDaylight(time, action.timeCost, day);
        return !(action.id === "setTrap" && consumables.trap.count === 0) ? (
          <ActionButton
            key={action.id}
            action={action}
            disabled={
              playerStatus.energy < action.energyCost || !canAfford || disabled
            }
            onClick={() => {
              switch (action.id) {
                case "forage": {
                  const forageYield = Math.round(
                    20 * berryIncomeMultiplier * Math.random(),
                  );
                  mutateResources({ berry: berry + forageYield });
                  break;
                }
                case "gatherWood": {
                  const woodBonus =
                    TOOL_DEFINITIONS.find((t) => t.key === "hatchet")?.levels[
                      tools.hatchet.level
                    ].bonus.woodGathering ?? 1;
                  const fiberDropped =
                    Math.random() < fiberDropChance * woodBonus ? 1 : 0;
                  mutateResources({
                    wood: wood + woodBonus,
                    fiber: fiber + fiberDropped,
                  });
                  break;
                }
                case "gatherStone": {
                  mutateResources({ stone: stone + 1 });
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
              const newLevel =
                knowledge.level +
                calculateLevelGain(
                  action.complexity || 0,
                  knowledge.tier,
                  knowledge.level,
                );

              mutateKnowledge({
                forest: {
                  level: newLevel % 100,
                  tier: Math.min(
                    knowledge.tier + Math.floor(newLevel / 100),
                    3,
                  ) as KnowledgeTier,
                },
              });

              updateTime({ time: time + action.timeCost });
              updatePlayerStatus({
                energy: Math.max(0, playerStatus.energy - action.energyCost),
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
