import { useState } from "preact/hooks";
import { useHandleExploration } from "../../../data/exploration/hooks";
import { useSmithingActions } from "../../../data/smithing/hooks";
import { Accordion, AccordionTopic } from "../../../style/Accordion";
import CurrencyDisplay from "../../../components/CurrencyDisplay";
import { useHandleNPCs, useNPC } from "../../../npc/npc-hooks";
import { objectEntries } from "../../../util";
import { Paragraph } from "../../../style/elements";
import { BLACKSMITH_TEXT } from "./blacksmith-text";
import NPCResourceTradePanel from "../../../npc/NPCResourceTradePanel";

const BlacksmithLocation = () => {
  const [trading, setTrading] = useState(false);
  const { exploration, mutateExploration } = useHandleExploration();
  const { smithing, unlockKnowledge } = useSmithingActions();
  const npc = useNPC("village_blacksmith", "blacksmith");
  const { mutateNPC } = useHandleNPCs();

  const inventory = exploration.inventory;
  const copperOre = inventory.copperOre ?? 0;
  const knowsCopper = smithing.copper.ore;

  if (!npc) return null;

  const handleShowOre = () => {
    unlockKnowledge("copper", "ore");
    mutateNPC("village_blacksmith", { trust: npc.trust + 1 });
  };

  const handleLeave = () => {
    mutateExploration({ location: undefined });
  };

  const trust = Math.floor(npc.trust);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <h2>The Village Blacksmith</h2>
        <p>
          The clang of hammer on anvil echoes from inside the workshop. A broad-shouldered smith
          works near a glowing forge, surrounded by tools and half-finished metalwork. He glances up
          as you enter.
        </p>

        {copperOre > 0 && !knowsCopper && (
          <button onClick={handleShowOre}>Show him the copper ore</button>
        )}

        {knowsCopper && (
          <>
            <Paragraph>Trust: {trust}</Paragraph>
            <Paragraph margin="0 0 15px">
              Money: <CurrencyDisplay amount={npc.resources.coin || 0} />
            </Paragraph>
            {trading ? (
              <NPCResourceTradePanel npc={npc} onCancel={() => setTrading(false)} />
            ) : (
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <button onClick={handleLeave}>Leave</button>
                <button
                  onClick={() => {
                    setTrading(true);
                  }}
                >
                  Trade
                </button>
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
