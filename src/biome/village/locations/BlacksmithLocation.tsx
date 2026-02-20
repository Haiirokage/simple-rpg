import { useHandleExploration } from "../../../data/exploration/hooks";
import { useSmithingActions } from "../../../data/smithing/hooks";
import { Accordion, AccordionTopic } from "../../../style/Accordion";
import CurrencyDisplay from "../../../components/CurrencyDisplay";
import { useGetOrCreateNPC, useMutateNPCs } from "../../../npc/npc-hooks";
import { mergeNumericRecords } from "../../../util";

const COPPER_ORE_PRICE = 8;

const BlacksmithLocation = () => {
  const { exploration, mutateExploration } = useHandleExploration();
  const { smithing, unlockKnowledge } = useSmithingActions();
  const getOrCreateNPC = useGetOrCreateNPC();
  const mutateNPCs = useMutateNPCs();

  const inventory = exploration.inventory;
  const copperOre = inventory.copperOre ?? 0;
  const knowsCopper = smithing.copper.ore;

  const handleShowOre = () => {
    unlockKnowledge("copper", "ore");
  };

  const handleSellOre = () => {
    const npc = getOrCreateNPC("village_blacksmith", "blacksmith");
    mutateExploration({
      inventory: mergeNumericRecords(inventory, { copperOre: -1, coin: COPPER_ORE_PRICE }),
    });
    mutateNPCs({
      [npc.id]: {
        ...npc,
        resources: {
          ...npc.resources,
          coin: (npc.resources.coin ?? 0) - COPPER_ORE_PRICE,
          copperOre: (npc.resources.copperOre ?? 0) + 1,
        },
      },
    });
  };

  const handleLeave = () => {
    mutateExploration({ location: undefined });
  };

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

        {knowsCopper && copperOre > 0 && (
          <button onClick={handleSellOre}>
            Sell copper ore. <CurrencyDisplay amount={COPPER_ORE_PRICE} />
          </button>
        )}

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button onClick={handleLeave}>Leave</button>
        </div>
      </div>

      <Accordion>
        <AccordionTopic label="Copper">
          {knowsCopper && (
            <span>
              Low grade copper ore can be found at rock outcroppings. Copper is always useful, I'll
              buy it off you if you bring me some.
            </span>
          )}
        </AccordionTopic>
      </Accordion>
    </div>
  );
};

export default BlacksmithLocation;
