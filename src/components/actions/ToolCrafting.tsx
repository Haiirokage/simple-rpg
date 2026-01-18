import { useResources, useMutateResources } from "../../data/resources/hooks";
import { getAffordability, hasDiscoveredResources } from "../../data/resources/util";
import { useHandleEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import type { ResourceStore } from "../../data/resources/types";
import { objectEntries } from "../../util";
import type { ToolType } from "../../data/equipment/types";
import { getEquipmentLevel } from "../../data/equipment/util";
import { useGrantSkillExperience, useSkills } from "../../data/skills/hooks";

const ToolCrafting = () => {
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const { resources, data } = useResources();
  const { mutate: mutateResources } = useMutateResources();
  const { getTool } = useHandleEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const advanceTime = useAdvanceTime();

  const craftTool = (toolKey: ToolType, tier: number, resourceResult: Partial<ResourceStore>) => {
    // Subtract costs from resources
    mutateResources(resourceResult);

    const newLevel = getEquipmentLevel(skills.crafting.level, tier);
    const tool = getTool(toolKey);
    const improvement = newLevel > tool.level || tier > tool.tier;
    if (improvement) {
      // Update tool to new level
      mutateSpecific("tools", {
        [toolKey]: { tier, level: newLevel },
      });
    }

    const exp = tier * 200 + newLevel;
    grantExperience({ crafting: improvement ? exp : exp / 4 });

    advanceTime(1);
  };

  return (
    <div className="tool-crafting">
      {TOOL_DEFINITIONS.map((toolDef) => {
        const toolStatus = getTool(toolDef.key);
        const toolTier = toolStatus?.tier || 0;
        const nextTier = toolTier + 1;
        const hasNextTier = nextTier < toolDef.tiers.length;

        const nextTierData = toolDef.tiers[nextTier];
        const getNextTierButton = () => {
          const costText = objectEntries(nextTierData.cost)
            .map(([key, cost]) => `${cost} ${key}`)
            .join(", ");
          const { canAfford, resourceResult } = getAffordability(nextTierData.cost, resources);
          return (
            <button
              disabled={!canAfford}
              onClick={() => craftTool(toolDef.key, nextTier, resourceResult)}
              style={{ fontSize: "0.9em" }}
            >
              Craft {nextTierData.name} {toolDef.name} {costText ? `(${costText})` : "(free)"}
            </button>
          );
        };
        const tierDefinition = toolDef.tiers[toolTier];
        const reforgeAffordability = getAffordability(tierDefinition.cost, resources);

        const hasDiscovered =
          (hasNextTier && hasDiscoveredResources(nextTierData.cost, data)) || nextTier > 0;

        return hasDiscovered ? (
          <div key={toolDef.key}>
            {hasNextTier ? (
              getNextTierButton()
            ) : (
              <p style={{ marginBottom: "0.25rem", opacity: 0.7 }}>
                {toolDef.name} (current: {tierDefinition.name}) - Max tier reached
              </p>
            )}
            {toolTier !== 0 && (
              <button
                disabled={!reforgeAffordability.canAfford}
                onClick={() =>
                  craftTool(toolDef.key, toolTier, reforgeAffordability.resourceResult)
                }
              >
                reforge
              </button>
            )}
          </div>
        ) : null;
      })}
    </div>
  );
};

export default ToolCrafting;
