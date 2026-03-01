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
import { useSmithing } from "../../data/smithing/hooks";
import { useComponentCost, formatComponentCost } from "../../data/craftComponents/hooks";
import type { ResourceStore } from "../../data/resources/types";
import { useHandleEquipment } from "../../data/equipment/hooks";
import ActionButton from "../ActionButton";
import { CLEAR_GROUND_ACTION } from "./definitions";
import { Paragraph, Button } from "../../style/elements";
import styled from "styled-components";
import { objectEntries } from "../../util";
import { usePlayerForce } from "../../data/attributes/hooks";
import TooltipWrapper from "../../style/TooltipWrapper";

const StructureButtonRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 0.5rem;
`;

const HomeConstruction = () => {
  const { resources } = useResources();
  const { plots, usedPlots, structures } = useStructures();
  const playerForce = usePlayerForce();
  const updateStructures = useUpdateStructures();
  const { mutate } = useMutateResources();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { getTool } = useHandleEquipment();
  const smithing = useSmithing();
  const { canAffordComponents, deductComponents } = useComponentCost();

  const berryIncomeMultiplier = useMemo(() => getBerryIncomeMultiplier(day), [day]);
  const visibleStructures = STRUCTURES.filter((s) => !s.unlocked || s.unlocked({ smithing }));

  const hasPlots = (building: StructureDefinition) =>
    !building.plotCost || usedPlots + building.plotCost <= plots;

  const buildStructure = (
    building: StructureDefinition,
    resourceResult: Partial<ResourceStore>,
  ) => {
    const currentCount = structures[building.key] || 0;
    mutate(resourceResult);
    updateTime({ time: time + building.timeCost });
    updateStructures({ [building.key]: currentCount + 1 });
    if (building.componentCost) deductComponents(building.componentCost);
  };

  const plotDifficulty = Math.pow(8, plots - 8);
  const basePlotChance = 0.2 / plotDifficulty;
  const { toolStatus } = getTool("hatchet");
  const hatchetMultiplier = Math.max(toolStatus.tier ** 2 * toolStatus.level, 1);
  const strengthMultiplier = 1 + playerForce / 80;
  const plotChance = Math.min(basePlotChance * hatchetMultiplier * strengthMultiplier, 1);

  const clearGround = () => {
    mutate({ wood: resources.wood + 2, stone: resources.stone + 1 });
    if (Math.random() < plotChance) {
      updateStructures({ plots: plots + 1 });
    }
  };

  return (
    <div>
      <div>
        <div style={{ marginBottom: "0.5rem" }}>
          <ActionButton
            name={CLEAR_GROUND_ACTION.name}
            cost={CLEAR_GROUND_ACTION.cost}
            onClick={clearGround}
            disabled={!isActionWithinDaylight(time, 8, day)}
          />
          <Paragraph margin="0.25rem 0 0 0">
            Chance of new plot: {(plotChance * 100).toFixed(1)}%
          </Paragraph>
        </div>
        Plots: {usedPlots}/{plots}
      </div>
      {visibleStructures.map((building) => {
        const { canAfford, resourceResult } = getAffordability(building.resourceCost, resources);
        const componentCostLabel = building.componentCost
          ? formatComponentCost(building.componentCost)
          : null;
        const isDisabled =
          !canAfford ||
          !hasPlots(building) ||
          (building.componentCost ? !canAffordComponents(building.componentCost) : false);
        const currentCount = (structures[building.key as keyof typeof structures] as number) || 0;

        return (
          <TooltipWrapper description={building.tooltip}>
            <StructureButtonRow key={building.key}>
              <Button
                disabled={isDisabled}
                onClick={() => buildStructure(building, resourceResult)}
              >
                {building.name} ({currentCount}) - Costs:{" "}
                {formatResourceCost(building.resourceCost)}
                {componentCostLabel ? `, ${componentCostLabel}` : ""}
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
          </TooltipWrapper>
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
          Berry yield reduced to {Math.round(berryIncomeMultiplier * 100)}% in {getMonthName(day)}
        </div>
      )}
    </div>
  );
};

export default HomeConstruction;
