import { useMutateResources, useResources } from "../../data/resources/hooks";
import { getAffordability, formatResourceCost } from "../../data/resources/util";
import { useStructures, useUpdateStructures } from "../../data/structures/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import {
  getBerryIncomeMultiplier,
  getMonthName,
  isActionWithinDaylight,
} from "../../data/time/season-util";
import { useMemo } from "preact/hooks";
import { STRUCTURES, type StructureDefinition } from "../../data/structures/definitions";
import type { ResourceStore } from "../../data/resources/types";
import { useEquipment } from "../../data/equipment/hooks";
import { usePlayerStatus, useUpdatePlayerStatus } from "../../data/playerStatus/hooks";
import ActionButton from "../ActionButton";
import { CLEAR_GROUND_ACTION } from "./definitions";
import { Paragraph, Button } from "../../style/elements";
import styled from "styled-components";
import { objectEntries } from "../../util";

const StructureButtonRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 0.5rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const HomeConstruction = () => {
  const { resources } = useResources();
  const { plots, usedPlots, structures } = useStructures();
  const updateStructures = useUpdateStructures();
  const { mutate } = useMutateResources();
  const mutatePlayerStatus = useUpdatePlayerStatus();
  const { data: playerStatus } = usePlayerStatus();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { tools } = useEquipment();

  const berryIncomeMultiplier = useMemo(() => getBerryIncomeMultiplier(day), [day]);

  // Helper to check if player has enough plots
  const hasPlots = (building: StructureDefinition) => {
    return !building.plotCost || usedPlots + building.plotCost <= plots;
  };

  // Helper to build a structure
  const buildStructure = (
    building: StructureDefinition,
    resourceResult: Partial<ResourceStore>,
  ) => {
    const currentCount = structures[building.key] || 0;

    mutate(resourceResult);
    updateTime({ time: time + building.timeCost });
    updateStructures({ [building.key]: currentCount + 1 });
  };

  // Plot chance: base 0.2 (20%) at 8 plots, divided by 10 for each additional plot
  // Hatchet multiplies chance by 50x per level
  const plotDifficulty = Math.pow(10, plots - 8);
  const basePlotChance = 0.2 / plotDifficulty;
  const hatchetMultiplier = tools.hatchet.level === "stone" ? 50 : 1;
  const plotChance = Math.min(basePlotChance * hatchetMultiplier, 1); // Cap at 100%

  // Clear ground action
  const clearGround = () => {
    mutate({ wood: resources.wood + 2, stone: resources.stone + 1 });
    mutatePlayerStatus({
      energy: playerStatus.energy - CLEAR_GROUND_ACTION.energyCost,
    });
    updateTime({ time: time + CLEAR_GROUND_ACTION.timeCost });

    if (Math.random() < plotChance) {
      updateStructures({ plots: plots + 1 });
    }
  };

  return (
    <div>
      <div>
        <div style={{ marginBottom: "0.5rem" }}>
          <ActionButton
            action={CLEAR_GROUND_ACTION}
            onClick={clearGround}
            disabled={!isActionWithinDaylight(time, 8, day) || playerStatus.energy < 70}
          />
          <Paragraph margin="0.25rem 0 0 0">
            Change of new plot: {(plotChance * 100).toFixed(2)}%
          </Paragraph>
        </div>
        Plots: {usedPlots}/{plots}
      </div>
      {STRUCTURES.map((building) => {
        const { canAfford, resourceResult } = getAffordability(building.resourceCost, resources);
        const isDisabled = !canAfford || !hasPlots(building);
        const currentCount = (structures[building.key as keyof typeof structures] as number) || 0;

        return (
          <StructureButtonRow key={building.key}>
            <Button disabled={isDisabled} onClick={() => buildStructure(building, resourceResult)}>
              {building.name} ({currentCount}) - Costs: {formatResourceCost(building.resourceCost)}
              {building.plotCost ? ` | ${building.plotCost} plots` : ""}
            </Button>
            {currentCount > 0 && (
              <Button
                onClick={() => {
                  updateStructures({ [building.key]: currentCount - 1 });
                  const refundedResources = objectEntries(building.resourceCost).reduce(
                    (acc, [key, cost]) => ({
                      ...acc,
                      [key]: (acc[key] ?? 0) + Math.floor(cost * 0.5),
                    }),
                    resources,
                  );
                  mutate(refundedResources);
                }}
              >
                −
              </Button>
            )}
          </StructureButtonRow>
        );
      })}
      {berryIncomeMultiplier < 1 && (
        <div
          style={{
            fontSize: "0.85em",
            opacity: 0.7,
            marginTop: "0.5rem",
          }}
        >
          Berry yield reduced {Math.round(berryIncomeMultiplier * 100)}% in {getMonthName(day)}
        </div>
      )}
    </div>
  );
};

export default HomeConstruction;
