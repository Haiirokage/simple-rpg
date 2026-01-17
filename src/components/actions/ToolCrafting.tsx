import { useResources, useMutateResources } from "../../data/resources/hooks";
import { getAffordability, hasDiscoveredResources } from "../../data/resources/util";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import type { ResourceStore } from "../../data/resources/types";
import { objectEntries } from "../../util";
import type { ToolType } from "../../data/equipment/types";

const ToolCrafting = () => {
  const { resources, data } = useResources();
  const { mutate: mutateResources } = useMutateResources();
  const { tools } = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const advanceTime = useAdvanceTime();

  const craftTool = (toolKey: ToolType, level: number, resourceResult: Partial<ResourceStore>) => {
    // Subtract costs from resources
    mutateResources(resourceResult);

    // Update tool to new level
    mutateSpecific("tools", {
      [toolKey]: { level },
    });

    advanceTime(1);
  };

  return (
    <div className="tool-crafting">
      {TOOL_DEFINITIONS.map((toolDef) => {
        const toolStatus = tools[toolDef.key];
        const toolLevel = toolStatus?.level || 0;
        const nextLevel = toolLevel + 1;
        const hasNextLevel = nextLevel < toolDef.tiers.length;

        if (!hasNextLevel) {
          const toolTier = toolDef.tiers[toolLevel];
          return (
            <div key={toolDef.key}>
              <p style={{ marginBottom: "0.25rem", opacity: 0.7 }}>
                {toolDef.name} (current: {toolTier.name}) - Max level reached
              </p>
            </div>
          );
        }

        const nextTierData = toolDef.tiers[nextLevel];
        const { canAfford, resourceResult } = getAffordability(nextTierData.cost, resources);

        const costText = objectEntries(nextTierData.cost)
          .map(([key, cost]) => `${cost} ${key}`)
          .join(", ");

        const hasDiscovered = hasDiscoveredResources(nextTierData.cost, data);

        return hasDiscovered ? (
          <div key={toolDef.key}>
            <button
              disabled={!canAfford}
              onClick={() => craftTool(toolDef.key, nextLevel, resourceResult)}
              style={{ fontSize: "0.9em" }}
            >
              Craft {nextTierData.name} {toolDef.name} {costText ? `(${costText})` : "(free)"}
            </button>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default ToolCrafting;
