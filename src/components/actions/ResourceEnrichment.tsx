import { useHandleEquipment } from "../../data/equipment/hooks";
import { LEATHER_ENRICHMENT } from "../../data/resources/enrichment-definitions";
import { useHandleResources, useResources } from "../../data/resources/hooks";
import {
  formatResourceCost,
  getAffordability,
  hasDiscoveredResources,
} from "../../data/resources/util";
import { useGrantSkillExperience, useSkills } from "../../data/skills/hooks";
import { Header3 } from "../../style/elements";
import TooltipWrapper from "../../style/TooltipWrapper";
import ActionButton from "../ActionButton";

const ResourceEnrichment = () => {
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const { data, addResources } = useHandleResources();
  const { resources } = useResources();
  const { getTool } = useHandleEquipment();

  const { energyCost, cost, timeCost } = LEATHER_ENRICHMENT;
  const knife = getTool("knife");
  const tanHide = () => {
    const craftingBonus = 1 + skills.crafting.level / 100;
    const toolBonus = 1 + (knife.toolStatus.tier * knife.toolStatus.level) / 50;
    const leatherYield = Math.round(2 * craftingBonus * toolBonus);
    addResources({ leather: leatherYield, hide: -cost.hide, wood: -cost.wood });
    grantExperience({ crafting: 10 });
  };
  const hasDiscovered = hasDiscoveredResources(cost, data);
  const { canAfford } = getAffordability(cost, resources);
  const costStr = formatResourceCost(cost);

  const disabled = knife.toolStatus.tier === 0 || !canAfford;
  return (
    <>
      {hasDiscovered ? (
        <>
          <Header3>Resource enrichment</Header3>

          <TooltipWrapper description="Clean the hide with a knife, treat it with a mixture of intestines and water, then smoke it.">
            <ActionButton
              name={`Tan hide${costStr ? ` (${costStr})` : ""}`}
              cost={{ energy: energyCost, time: timeCost }}
              disabled={disabled}
              onClick={tanHide}
            />
          </TooltipWrapper>
        </>
      ) : null}
    </>
  );
};

export default ResourceEnrichment;
