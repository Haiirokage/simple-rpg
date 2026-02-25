import { useState } from "preact/hooks";
import { useHandleExploration } from "../../../data/exploration/hooks";
import { useSmithingActions } from "../../../data/smithing/hooks";
import { useGrantSkillExperience, useSkills } from "../../../data/skills/hooks";
import { Accordion, AccordionTopic } from "../../../style/Accordion";
import CurrencyDisplay from "../../../components/CurrencyDisplay";
import { useHandleNPCs, useNPC } from "../../../npc/npc-hooks";
import { mergeNumericRecords, objectEntries, rollFractional } from "../../../util";
import { Paragraph } from "../../../style/elements";
import { BLACKSMITH_TEXT } from "./blacksmith-text";
import NPCResourceTradePanel from "../../../npc/NPCResourceTradePanel";

const COPPER_HARD_CAP = 0.3;
const COPPER_BASE_SKILL = 0.3;
const SKILL_PER_LEVEL = 0.02;
const COPPER_XP_PER_YIELD = 25;

const BlacksmithLocation = () => {
  const [display, setDisplay] = useState<"trading" | "smelting">();
  const [selectedOre, setSelectedOre] = useState(1);
  const [selectedCharcoal, setSelectedCharcoal] = useState(1);
  const { exploration, mutateExploration } = useHandleExploration();
  const { smithing, unlockKnowledge } = useSmithingActions();
  const { skills } = useSkills();
  const grantExperience = useGrantSkillExperience();
  const npc = useNPC("village_blacksmith", "blacksmith");
  const { mutateNPC } = useHandleNPCs();

  const inventory = exploration.inventory;
  const copperOre = inventory.copperOre ?? 0;
  const charcoal = inventory.charcoal ?? 0;
  const knowsCopper = smithing.copper.ore;

  if (!npc) return null;

  const handleShowOre = () => {
    unlockKnowledge("copper", "ore");
    mutateNPC("village_blacksmith", { trust: npc.trust + 1 });
  };

  const handleLeave = () => {
    mutateExploration({ location: undefined });
  };

  const skillMultiplier = COPPER_BASE_SKILL + skills.smithing.level * SKILL_PER_LEVEL;
  const charcoalFactor = 0.8 * Math.sqrt(selectedCharcoal / selectedOre);
  const expectedYield =
    selectedOre * COPPER_HARD_CAP * Math.min(1, charcoalFactor * skillMultiplier);

  const handleSmelt = () => {
    const bars = rollFractional(expectedYield);
    mutateExploration({
      inventory: mergeNumericRecords(inventory, {
        copperOre: -selectedOre,
        charcoal: -selectedCharcoal,
        copperBar: bars,
      }),
    });
    const baseExp = bars > 0 ? bars : expectedYield;
    grantExperience({ smithing: baseExp * COPPER_XP_PER_YIELD });
  };

  const trust = Math.floor(npc.trust);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <h2>The Village Blacksmith </h2>

        <p>
          The clang of hammer on anvil echoes from inside the workshop. A broad-shouldered smith
          works near a glowing forge, surrounded by tools and half-finished metalwork. He glances up
          as you enter.
        </p>

        {copperOre > 0 && !knowsCopper && (
          <button onClick={handleShowOre}>Show him the copper ore</button>
        )}

        {knowsCopper && !smithing.smelting.basics && trust >= 5 && (
          <button onClick={() => unlockKnowledge("smelting", "basics")}>
            Ask him about smelting
          </button>
        )}

        {knowsCopper && (
          <>
            <Paragraph>Trust: {trust}</Paragraph>
            <Paragraph margin="0 0 15px">
              Money: <CurrencyDisplay amount={npc.resources.coin || 0} />
            </Paragraph>
            {display === "trading" && (
              <NPCResourceTradePanel npc={npc} onCancel={() => setDisplay(undefined)} />
            )}
            {display === "smelting" && (
              <div>
                <p>
                  Ore:{" "}
                  <button
                    disabled={selectedOre <= 1}
                    onClick={() => setSelectedOre(selectedOre - 1)}
                  >
                    −
                  </button>{" "}
                  {selectedOre}{" "}
                  <button
                    disabled={selectedOre >= copperOre}
                    onClick={() => setSelectedOre(selectedOre + 1)}
                  >
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
                <button onClick={() => setDisplay(undefined)}>Cancel</button>
              </div>
            )}
            {!display && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <button onClick={handleLeave}>Leave</button>
                <button onClick={() => setDisplay("trading")}>Trade</button>
                {smithing.smelting.basics && (
                  <button onClick={() => setDisplay("smelting")}>Smelt</button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Accordion>
        {objectEntries(smithing).map(([topic, knowledge]) => {
          const topicText = BLACKSMITH_TEXT[topic];
          const activeEntries = objectEntries(knowledge).filter(([, active]) => active);
          if (activeEntries.length === 0) return null;
          return (
            <AccordionTopic key={topic} label={topicText.label}>
              {activeEntries.map(([key]) => (
                <p key={key}>{topicText.entries[key]}</p>
              ))}
            </AccordionTopic>
          );
        })}
      </Accordion>
    </div>
  );
};

export default BlacksmithLocation;
