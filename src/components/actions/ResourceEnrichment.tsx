import { useHandleEquipment } from "../../data/equipment/hooks";
import {
  CHARCOAL_ENRICHMENT,
  LEATHER_ENRICHMENT,
} from "../../data/resources/enrichment-definitions";
import { useHandleResources, useResources } from "../../data/resources/hooks";
import {
  formatResourceCost,
  getAffordability,
  hasDiscoveredResources,
} from "../../data/resources/util";
import { useGrantSkillExperience, useSkills } from "../../data/skills/hooks";
import { useSmithing } from "../../data/smithing/hooks";
import { Header3 } from "../../style/elements";
import TooltipWrapper from "../../style/TooltipWrapper";
import ActionButton from "../ActionButton";

const ResourceEnrichment = () => {
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const { data, addResources } = useHandleResources();
  const { resources } = useResources();
  const { getTool } = useHandleEquipment();

  const leather = LEATHER_ENRICHMENT;
  const knife = getTool("knife");
  const tanHide = () => {
    const craftingBonus = 1 + skills.crafting.level / 100;
    const toolBonus = 1 + (knife.toolStatus.tier * knife.toolStatus.level) / 50;
    const leatherYield = Math.round(2 * craftingBonus * toolBonus);
    addResources({ leather: leatherYield, hide: -leather.cost.hide, wood: -leather.cost.wood });
    grantExperience({ crafting: 30 });
  };
  const leatherDiscovered = hasDiscoveredResources(leather.cost, data);
  const { canAfford: canAffordLeather } = getAffordability(leather.cost, resources);
  const leatherCostStr = formatResourceCost(leather.cost);

  const charcoal = CHARCOAL_ENRICHMENT;
  const burnCharcoal = () => {
    addResources({ charcoal: charcoal.result.charcoal, wood: -charcoal.cost.wood });
    grantExperience({ crafting: 15 });
  };
  const smithing = useSmithing();
  const charcoalDiscovered = smithing.smelting.basics;
  const { canAfford: canAffordCharcoal } = getAffordability(charcoal.cost, resources);
  const charcoalCostStr = formatResourceCost(charcoal.cost);

  const showSection = leatherDiscovered || charcoalDiscovered;

  return (
    <>
      {showSection && <Header3>Resource enrichment</Header3>}
      {leatherDiscovered && (
        <TooltipWrapper description="Clean the hide with a knife, treat it with a mixture of intestines and water, then smoke it.">
          <ActionButton
            name={`Tan hide (${leatherCostStr})`}
            cost={{ energy: leather.energyCost, time: leather.timeCost }}
            disabled={knife.toolStatus.tier === 0 || !canAffordLeather}
            onClick={tanHide}
          />
        </TooltipWrapper>
      )}
      {charcoalDiscovered && (
        <TooltipWrapper description="Stack wood tightly inside a clay mound, then burn it slowly over many hours with limited airflow to produce charcoal.">
          <ActionButton
            name={`Burn charcoal (${charcoalCostStr})`}
            cost={{ energy: charcoal.energyCost, time: charcoal.timeCost }}
            disabled={!canAffordCharcoal}
            onClick={burnCharcoal}
          />
        </TooltipWrapper>
      )}
    </>
  );
};

export default ResourceEnrichment;
