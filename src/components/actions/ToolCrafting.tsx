import { useResources, useMutateResources } from "../../data/resources/hooks";
import { getAffordability, hasDiscoveredResources } from "../../data/resources/util";
import { useHandleEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import type { ToolTier } from "../../data/equipment/definitions";
import { useComponentCost, formatComponentCost } from "../../data/craftComponents/hooks";
import type { ResourceStore } from "../../data/resources/types";
import { objectEntries } from "../../util";
import type { ToolType } from "../../data/equipment/types";
import { getEquipmentLevel, getLevelBias } from "../../data/equipment/util";
import { useGrantSkillExperience, useSkills } from "../../data/skills/hooks";
import { getExpThreshold } from "../../data/leveling-util";
import TooltipWrapper from "../../style/TooltipWrapper";
import styled from "styled-components";
import { useDiscoveries } from "../../data/discoveries/hooks";

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ToolCraftingWrapper = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ToolCrafting = () => {
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const { resources, data } = useResources();
  const { mutate: mutateResources } = useMutateResources();
  const { getTool } = useHandleEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const { canAffordComponents, deductComponents } = useComponentCost();
  const discoveries = useDiscoveries();
  const advanceTime = useAdvanceTime();

  const craftingLevel = skills.crafting.level;

  const craftTool = (
    toolKey: ToolType,
    tier: number,
    resourceResult: Partial<ResourceStore>,
    componentCost: ToolTier["componentCost"],
  ) => {
    mutateResources(resourceResult);
    deductComponents(componentCost);

    const newLevel = getEquipmentLevel(craftingLevel, tier);
    const { toolStatus } = getTool(toolKey);
    const improvement = newLevel > toolStatus.level || tier > toolStatus.tier;
    if (improvement) {
      mutateSpecific("tools", {
        [toolKey]: { tier, level: newLevel },
      });
    }

    const exp = (getExpThreshold((tier - 1) * 10) / Math.pow(2, tier - 1)) * Math.sqrt(newLevel);
    grantExperience({ crafting: improvement ? exp : exp / 4 });

    advanceTime(1);
  };

  return (
    <ToolCraftingWrapper>
      {objectEntries(TOOL_DEFINITIONS).map(([toolKey, toolDef]) => {
        const { toolStatus } = getTool(toolKey);
        const toolTier = toolStatus?.tier || 0;
        const nextTier = toolTier + 1;
        const hasNextTier = nextTier < toolDef.tiers.length;

        if (toolKey === "pick" && discoveries.copper_identified === 0) return null;

        const nextTierData = toolDef.tiers[nextTier];
        const getNextTierButton = () => {
          const { canAfford, resourceResult } = getAffordability(nextTierData.cost, resources);
          const canAffordAll = canAfford && canAffordComponents(nextTierData.componentCost);
          const bias = getLevelBias(craftingLevel, nextTier);
          const levelGated = bias < 0;
          const nextCostText = [
            ...objectEntries(nextTierData.cost).map(([key, cost]) => `${cost} ${key}`),
            formatComponentCost(nextTierData.componentCost),
          ]
            .filter(Boolean)
            .join(", ");

          const tooltip = levelGated
            ? `Requires crafting level ${(nextTier - 1) * 10}`
            : `Median level: ${bias}, cost: ${nextCostText}`;
          return (
            <TooltipWrapper description={tooltip}>
              <button
                disabled={!canAffordAll || levelGated}
                onClick={() =>
                  craftTool(toolDef.key, nextTier, resourceResult, nextTierData.componentCost)
                }
                style={{ fontSize: "0.9em" }}
              >
                Craft {nextTierData.name} tier
              </button>
            </TooltipWrapper>
          );
        };
        const tierDefinition = toolDef.tiers[toolTier];

        const costText = [
          ...objectEntries(tierDefinition.cost).map(([key, cost]) => `${cost} ${key}`),
          formatComponentCost(tierDefinition.componentCost),
        ]
          .filter(Boolean)
          .join(", ");
        const reforgeAffordability = getAffordability(tierDefinition.cost, resources);
        const canReforge =
          reforgeAffordability.canAfford && canAffordComponents(tierDefinition.componentCost);

        const hasDiscovered =
          (hasNextTier && hasDiscoveredResources(nextTierData.cost, data)) || nextTier > 0;

        return hasDiscovered ? (
          <div key={toolDef.key}>
            <label style={{ fontWeight: "700" }}>
              {toolDef.name}
              {tierDefinition.name === "none" ? "" : ` (${tierDefinition.name})`}
            </label>
            <ButtonRow>
              {toolTier !== 0 && (
                <TooltipWrapper
                  description={`Median level: ${getLevelBias(craftingLevel, toolTier)}, (${costText}). You already have a ${tierDefinition.name} ${toolDef.name}, but if you are displeased with it's quality you can attempt to reforge it to get a higher level. Maybe you will also learn something`}
                >
                  <button
                    disabled={!canReforge || getLevelBias(craftingLevel, toolTier) < 0}
                    onClick={() =>
                      craftTool(
                        toolDef.key,
                        toolTier,
                        reforgeAffordability.resourceResult,
                        tierDefinition.componentCost,
                      )
                    }
                  >
                    reforge
                  </button>
                </TooltipWrapper>
              )}
              {hasNextTier && getNextTierButton()}
            </ButtonRow>
          </div>
        ) : null;
      })}
    </ToolCraftingWrapper>
  );
};

export default ToolCrafting;
