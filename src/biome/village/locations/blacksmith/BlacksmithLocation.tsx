import { useState } from "preact/hooks";
import { useHandleExploration } from "../../../../data/exploration/hooks";
import { useSmithingActions } from "../../../../data/smithing/hooks";
import { Accordion, AccordionTopic } from "../../../../style/Accordion";
import CurrencyDisplay from "../../../../components/CurrencyDisplay";
import { useHandleNPCs, useNPC } from "../../../../npc/npc-hooks";
import { objectEntries } from "../../../../util";
import { Paragraph } from "../../../../style/elements";
import { BLACKSMITH_TEXT } from "./blacksmith-text";
import NPCResourceTradePanel from "../../../../npc/NPCResourceTradePanel";
import SmeltingPanel from "./SmeltingPanel";
import CastingPanel from "./CastingPanel";

const BlacksmithLocation = () => {
  const [display, setDisplay] = useState<"trading" | "smelting" | "casting">();
  const { exploration, mutateExploration } = useHandleExploration();
  const { smithing, unlockKnowledge } = useSmithingActions();
  const npc = useNPC("village_blacksmith", "blacksmith");
  const { mutateNPC } = useHandleNPCs();

  const copperOre = exploration.inventory.copperOre ?? 0;
  const carryBars = exploration.craftComponents.bar.copper;
  const knowsCopper = smithing.copper.ore;

  if (!npc) return null;

  const trust = Math.floor(npc.trust);

  const handleShowOre = () => {
    unlockKnowledge("copper", "ore");
    mutateNPC("village_blacksmith", { trust: npc.trust + 1 });
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <h2>The Village Blacksmith</h2>
        <Paragraph>Trust: {trust}</Paragraph>

        {!display && (
          <Paragraph margin="0.5rem 0">
            The clang of hammer on anvil echoes from inside the workshop. A broad-shouldered smith
            works near a glowing forge, surrounded by tools and half-finished metalwork. He glances
            up as you enter.
          </Paragraph>
        )}

        {copperOre > 0 && !knowsCopper && (
          <button onClick={handleShowOre}>Show him the copper ore</button>
        )}

        {knowsCopper && !smithing.smelting.basics && trust >= 5 && (
          <button onClick={() => unlockKnowledge("smelting", "basics")}>
            Ask him about smelting
          </button>
        )}

        {smithing.smelting.basics &&
          !smithing.casting.knifeBlade &&
          trust >= 6 &&
          carryBars >= 1 && (
            <button onClick={() => unlockKnowledge("casting", "knifeBlade")}>
              Show him the copper bar you made
            </button>
          )}

        {knowsCopper && (
          <>
            {display === "trading" && (
              <>
                <Paragraph margin="0 0 15px">
                  Money: <CurrencyDisplay amount={npc.resources.coin || 0} />
                </Paragraph>
                <NPCResourceTradePanel npc={npc} onCancel={() => setDisplay(undefined)} />
              </>
            )}
            {display === "smelting" && <SmeltingPanel onCancel={() => setDisplay(undefined)} />}
            {display === "casting" && <CastingPanel onCancel={() => setDisplay(undefined)} />}
            {!display && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <button onClick={() => mutateExploration({ location: undefined })}>Leave</button>
                <button onClick={() => setDisplay("trading")}>Trade</button>
                {smithing.smelting.basics && (
                  <button onClick={() => setDisplay("smelting")}>Smelt</button>
                )}
                {smithing.casting.knifeBlade && (
                  <button onClick={() => setDisplay("casting")}>Cast</button>
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
