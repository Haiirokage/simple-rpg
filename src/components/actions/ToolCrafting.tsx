import { useResources, useMutateResources } from "../../data/resources/hooks";
import { getAffordability } from "../../data/resources/util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useTime, useUpdateTime } from "../../data/time/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import type { ResourceStore } from "../../data/resources/types";
import { objectEntries } from "../../util";
import type { ToolType, LevelType } from "../../data/equipment/types";
import { toolLevels } from "../../data/equipment/types";

const ToolCrafting = () => {
  const { resources } = useResources();
  const { mutate: mutateResources } = useMutateResources();
  const { tools } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const { time } = useTime();
  const updateTime = useUpdateTime();

  const craftTool = (
    toolKey: ToolType,
    level: LevelType,
    resourceResult: Partial<ResourceStore>,
  ) => {
    // Subtract costs from resources
    mutateResources(resourceResult);

    // Update tool to new level
    mutateSpecific("tools", {
      [toolKey]: { level },
    });

    updateTime({ time: time + 1 });
  };

  return (
    <div className="tool-crafting">
      {TOOL_DEFINITIONS.map((toolDef) => {
        const toolStatus = tools[toolDef.key];
        const currentLevelIndex = toolLevels.indexOf(toolStatus.level);
        const nextLevelIndex = currentLevelIndex + 1;
        const hasNextLevel = nextLevelIndex < toolLevels.length;

        if (!hasNextLevel) {
          return (
            <div key={toolDef.key}>
              <p style={{ marginBottom: "0.25rem", opacity: 0.7 }}>
                {toolDef.name} (current: {toolStatus.level}) - Max level reached
              </p>
            </div>
          );
        }

        const nextLevel = toolLevels[nextLevelIndex];
        const nextLevelData = toolDef.levels[nextLevel];
        const { canAfford, resourceResult } = getAffordability(nextLevelData.cost, resources);

        const costText = objectEntries(nextLevelData.cost)
          .map(([key, cost]) => `${cost} ${key}`)
          .join(", ");

        return (
          <div key={toolDef.key}>
            <button
              disabled={!canAfford}
              onClick={() => craftTool(toolDef.key, nextLevel as LevelType, resourceResult)}
              style={{ fontSize: "0.9em" }}
            >
              Craft {nextLevel} {toolDef.name} {costText ? `(${costText})` : "(free)"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToolCrafting;
