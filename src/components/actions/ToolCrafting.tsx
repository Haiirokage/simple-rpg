import { useResources, useMutateResources } from "../../data/resources/hooks";
import { getAffordability, hasDiscoveredResources } from "../../data/resources/util";
import { useHandleEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import type { ResourceStore } from "../../data/resources/types";
import { objectEntries } from "../../util";
import type { ToolType } from "../../data/equipment/types";
import { getEquipmentLevel, getLevelBias } from "../../data/equipment/util";
import { useGrantSkillExperience, useSkills } from "../../data/skills/hooks";
import { getExpThreshold } from "../../data/leveling-util";
import TooltipWrapper from "../../style/TooltipWrapper";

const ToolCrafting = () => {
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const { resources, data } = useResources();
  const { mutate: mutateResources } = useMutateResources();
  const { getTool } = useHandleEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const advanceTime = useAdvanceTime();

  const craftingLevel = skills.crafting.level;

  const craftTool = (toolKey: ToolType, tier: number, resourceResult: Partial<ResourceStore>) => {
    // Subtract costs from resources
    mutateResources(resourceResult);

    const newLevel = getEquipmentLevel(craftingLevel, tier);
    const { toolStatus } = getTool(toolKey);
    const improvement = newLevel > toolStatus.level || tier > toolStatus.tier;
    if (improvement) {
      // Update tool to new level
      mutateSpecific("tools", {
        [toolKey]: { tier, level: newLevel },
      });
    }

    const exp = (getExpThreshold((tier - 1) * 10) / Math.pow(2, tier - 1)) * Math.sqrt(newLevel);
    grantExperience({ crafting: improvement ? exp : exp / 4 });

    advanceTime(1);
  };

  return (
    <div className="tool-crafting">
      {objectEntries(TOOL_DEFINITIONS).map(([toolKey, toolDef]) => {
        const { toolStatus } = getTool(toolKey);
        const toolTier = toolStatus?.tier || 0;
        const nextTier = toolTier + 1;
        const hasNextTier = nextTier < toolDef.tiers.length;

        const nextTierData = toolDef.tiers[nextTier];
        const getNextTierButton = () => {
          const nextCostText = objectEntries(nextTierData.cost)
            .map(([key, cost]) => `${cost} ${key}`)
            .join(", ");
          const { canAfford, resourceResult } = getAffordability(nextTierData.cost, resources);
          const bias = getLevelBias(craftingLevel, nextTier);
          const levelGated = bias < 0;

          const tooltip = levelGated
            ? `Requires crafting level ${(nextTier - 1) * 10}`
            : `Median level: ${bias}`;
          return (
            <TooltipWrapper description={tooltip}>
              <button
                disabled={!canAfford || levelGated}
                onClick={() => craftTool(toolDef.key, nextTier, resourceResult)}
                style={{ fontSize: "0.9em" }}
              >
                Craft {nextTierData.name} {toolDef.name}{" "}
                {nextCostText ? `(${nextCostText})` : "(free)"}
              </button>
            </TooltipWrapper>
          );
        };
        const tierDefinition = toolDef.tiers[toolTier];

        const costText = objectEntries(tierDefinition.cost)
          .map(([key, cost]) => `${cost} ${key}`)
          .join(", ");
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
              <TooltipWrapper
                description={`(${costText}). You already have a ${tierDefinition.name} ${toolDef.name}, but if you are displeased with it's quality you can attempt to reforge it to get a higher level. Maybe you will also learn something`}
              >
                <button
                  disabled={
                    !reforgeAffordability.canAfford || getLevelBias(craftingLevel, toolTier) < 0
                  }
                  onClick={() =>
                    craftTool(toolDef.key, toolTier, reforgeAffordability.resourceResult)
                  }
                >
                  reforge
                </button>
              </TooltipWrapper>
            )}
          </div>
        ) : null;
      })}
    </div>
  );
};

export default ToolCrafting;
