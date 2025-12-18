import { useMutateResources, useResources } from "../../data/resources/hooks";
import {
  getAffordability,
  formatResourceCost,
} from "../../data/resources/util";
import {
  useStructures,
  useUpdateStructures,
} from "../../data/structures/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import {
  getBerryIncomeMultiplier,
  getMonthName,
} from "../../data/time/season-util";
import { useMemo } from "preact/hooks";
import {
  STRUCTURES,
  type StructureDefinition,
} from "../../data/structures/definitions";
import type { ResourceStore } from "../../data/resources/types";
import { useEquipment } from "../../data/equipment/hooks";

const HomeConstruction = () => {
  const { resources } = useResources();
  const { plots, usedPlots, structures } = useStructures();
  const updateStructures = useUpdateStructures();
  const { mutate } = useMutateResources();
  const { time, day } = useTime();
  const updateTime = useUpdateTime();
  const { tools } = useEquipment();

  const berryIncomeMultiplier = useMemo(
    () => getBerryIncomeMultiplier(day),
    [day],
  );

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

  // Clear ground action
  const clearGround = () => {
    mutate({ wood: resources.wood + 2, stone: resources.stone + 1 });
    updateTime({ time: time + 8 });

    // Plot chance decreases with more plots, increases with better hatchet
    const basePlotChance = Math.max(0, 0.3 - usedPlots * 0.02);
    const hatchetBonus = tools.hatchet.level === "stone" ? 0.1 : 0;
    const plotChance = basePlotChance + hatchetBonus;

    if (Math.random() < plotChance) {
      updateStructures({ plots: plots + 1 });
    }
  };

  return (
    <div>
      <div>
        <div style={{ marginBottom: "0.5rem" }}>
          <button onClick={clearGround}>
            Clear ground (8 hours) - Gives 2 wood + 1 stone
          </button>
        </div>
        Plots: {usedPlots}/{plots}
      </div>
      {STRUCTURES.map((building, idx) => {
        const { canAfford, resourceResult } = getAffordability(
          building.resourceCost,
          resources,
        );
        const isDisabled = !canAfford || !hasPlots(building);
        const currentCount =
          (structures[building.key as keyof typeof structures] as number) || 0;

        return (
          <div
            style={{ marginTop: idx > 0 ? "0.5rem" : "0" }}
            key={building.key}
          >
            <button
              disabled={isDisabled}
              onClick={() => buildStructure(building, resourceResult)}
            >
              {building.name} ({currentCount}) - Costs:{" "}
              {formatResourceCost(building.resourceCost)}
              {building.plotCost ? ` | ${building.plotCost} plots` : ""}
            </button>
          </div>
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
          Berry yield reduced {Math.round(berryIncomeMultiplier * 100)}% in{" "}
          {getMonthName(day)}
        </div>
      )}
    </div>
  );
};

export default HomeConstruction;
