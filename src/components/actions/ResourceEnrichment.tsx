import { useHandleEquipment } from "../../data/equipment/hooks";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import { LEATHER_ENRICHMENT } from "../../data/resources/enrichment-definitions";
import { useHandleResources } from "../../data/resources/hooks";
import { getAffordability, hasDiscoveredResources } from "../../data/resources/util";
import { useGrantSkillExperience, useSkills } from "../../data/skills/hooks";
import { useAdvanceTime } from "../../data/time/hooks";
import { Header3 } from "../../style/elements";
import TooltipWrapper from "../../style/TooltipWrapper";
import ActionButton from "../ActionButton";

const ResourceEnrichment = () => {
  const advanceTime = useAdvanceTime();
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const { resources, data, addResources } = useHandleResources();
  const { getTool } = useHandleEquipment();

  const { energyCost, cost, timeCost } = LEATHER_ENRICHMENT;
  const hasEnergy = playerStatus.energy >= energyCost;
  const { canAfford } = getAffordability(cost, resources);
  const knife = getTool("knife");
  const tanHide = () => {
    const craftingBonus = 1 + skills.crafting.level / 100;
    const toolBonus = 1 + (knife.toolStatus.tier * knife.toolStatus.level) / 50;
    const leatherYield = Math.round(2 * craftingBonus * toolBonus);
    addResources({ hide: -1, leather: leatherYield });
    updatePlayerStatus({ energy: -energyCost });
    advanceTime(timeCost);
    grantExperience({ crafting: 10 });
  };
  const hasDiscovered = hasDiscoveredResources(cost, data);

  const disabled = !hasEnergy || !canAfford || knife.toolStatus.tier === 0;
  return (
    <>
      {hasDiscovered ? (
        <>
          <Header3>Resource enrichment</Header3>

          <TooltipWrapper description="Clean the hide with a knife, treat it with a mixture of intestines and water, then smoke it.">
            <ActionButton
              disabled={disabled}
              action={{
                name: "Tan hide",
                energyCost: energyCost,
                timeCost: timeCost,
              }}
              onClick={tanHide}
            />
          </TooltipWrapper>
        </>
      ) : null}
    </>
  );
};

export default ResourceEnrichment;
