import { useState } from "preact/hooks";
import { useHandleExploration } from "../../../../data/exploration/hooks";
import { useGrantSkillExperience, useSkills } from "../../../../data/skills/hooks";
import { mergeNumericRecords, rollFractional } from "../../../../util";

const COPPER_HARD_CAP = 0.35;
const COPPER_BASE_SKILL = 0.4;
const SKILL_PER_LEVEL = 0.02;
const COPPER_XP_PER_YIELD = 25;

type Props = { onCancel: () => void };

const SmeltingPanel = ({ onCancel }: Props) => {
  const [selectedOre, setSelectedOre] = useState(1);
  const [selectedCharcoal, setSelectedCharcoal] = useState(1);
  const { exploration, mutateExploration } = useHandleExploration();
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();

  const copperOre = exploration.inventory.copperOre ?? 0;
  const charcoal = exploration.inventory.charcoal ?? 0;

  const skillMultiplier = COPPER_BASE_SKILL + skills.smithing.level * SKILL_PER_LEVEL;
  const charcoalFactor = 0.8 * Math.sqrt(selectedCharcoal / selectedOre);
  const expectedYield = Math.min(
    selectedOre * COPPER_HARD_CAP * Math.min(1, charcoalFactor * skillMultiplier),
    Math.floor(COPPER_HARD_CAP * selectedOre),
  );

  console.log("exp yield", expectedYield, charcoalFactor, skillMultiplier);

  const handleSmelt = () => {
    const bars = rollFractional(expectedYield);
    mutateExploration({
      inventory: mergeNumericRecords(exploration.inventory, {
        copperOre: -selectedOre,
        charcoal: -selectedCharcoal,
      }),
      craftComponents: {
        ...exploration.craftComponents,
        bar: { type: "metal", copper: exploration.craftComponents.bar.copper + bars },
      },
    });
    const baseExp = bars > 0 ? bars : expectedYield;
    grantExperience({ smithing: baseExp * COPPER_XP_PER_YIELD });
  };

  return (
    <div>
      <p>
        Ore:{" "}
        <button disabled={selectedOre <= 0} onClick={() => setSelectedOre(selectedOre - 1)}>
          −
        </button>{" "}
        {selectedOre}{" "}
        <button disabled={selectedOre >= copperOre} onClick={() => setSelectedOre(selectedOre + 1)}>
          +
        </button>{" "}
        (of {copperOre})
      </p>
      <p>
        Charcoal:{" "}
        <button
          disabled={selectedCharcoal <= 0}
          onClick={() => setSelectedCharcoal(selectedCharcoal - 1)}
        >
          −
        </button>{" "}
        {selectedCharcoal}{" "}
        <button
          disabled={selectedCharcoal >= charcoal}
          onClick={() => setSelectedCharcoal(selectedCharcoal + 1)}
        >
          +
        </button>{" "}
        (of {charcoal})
      </p>
      {expectedYield >= 0.5 && <p>Expected yield: ~{expectedYield.toFixed(2)} bars</p>}
      <button disabled={expectedYield < 0.5} onClick={handleSmelt}>
        Smelt
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default SmeltingPanel;
