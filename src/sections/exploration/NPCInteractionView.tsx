import { ENCOUNTER_FRAMES } from "../../data/encounters/definitions";
import { useHandleEncounter, useSetEncounter } from "../../data/encounters/hooks";
import { useHandleResources } from "../../data/resources/hooks";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { useNPCs, useMutateNPCs } from "../../npc/npc-hooks";
import type { HumanInstance } from "../../npc/npc-types";
import type { BudgetEntry, SellEntry } from "../../npc/human-definitions";
import CurrencyDisplay from "../../components/CurrencyDisplay";

const NPCInteractionView = () => {
  const { encounter } = useHandleEncounter();
  const setEncounter = useSetEncounter();
  const npcs = useNPCs();
  const mutateNPCs = useMutateNPCs();
  const { resources, addResources } = useHandleResources();
  const equipment = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();

  const frame = encounter.encounterFrameId
    ? ENCOUNTER_FRAMES[encounter.encounterFrameId]
    : undefined;

  const npcId = encounter.npcs[0];
  const npc = npcs[npcId];

  if (!npc || !frame) return null;

  const npcIronScribble = npc.resources.coin ?? 0;

  const updateNPC = (updates: Partial<HumanInstance>) => {
    mutateNPCs({ [npc.id]: { ...npc, ...updates } });
  };

  const handleSellToNPC = (entry: BudgetEntry) => {
    addResources({ [entry.resource]: -1, coin: entry.price });
    updateNPC({
      resources: {
        ...npc.resources,
        coin: npcIronScribble - entry.price,
        [entry.resource]: (npc.resources[entry.resource] ?? 0) + 1,
      },
    });
  };

  const handleBuyFromNPC = (entry: SellEntry) => {
    const toolStatus = npc.equipment[entry.tool];
    if (!toolStatus) return;

    addResources({ coin: -entry.price });
    mutateSpecific("tools", { [entry.tool]: { ...toolStatus } });
    updateNPC({
      resources: {
        ...npc.resources,
        coin: npcIronScribble + entry.price,
      },
      equipment: { ...npc.equipment, [entry.tool]: undefined },
      sellList: npc.sellList.filter((s) => s.tool !== entry.tool),
    });
  };

  return (
    <div>
      <h2>{frame.title}</h2>
      <p>{frame.description}</p>
      <p style={{ opacity: 0.7 }}>
        Your coin: <CurrencyDisplay amount={resources.coin} />
      </p>
      <div style={{ marginTop: "1rem" }}>
        {npc.budget.map((entry) => {
          const playerHas = resources[entry.resource] >= 1;
          const npcCanAfford = npcIronScribble >= entry.price;

          return (
            <button
              key={`sell-${entry.resource}`}
              disabled={!playerHas || !npcCanAfford}
              onClick={() => handleSellToNPC(entry)}
              style={{ marginRight: "0.5rem" }}
            >
              Sell {entry.resource} (<CurrencyDisplay amount={entry.price} />)
            </button>
          );
        })}
        {npc.sellList.map((entry) => {
          const toolStatus = npc.equipment[entry.tool];
          if (!toolStatus) return null;
          const tierName = TOOL_DEFINITIONS[entry.tool].tiers[toolStatus.tier]?.name ?? "";
          const playerCanAfford = resources.coin >= entry.price;
          const playerTier = equipment.tools[entry.tool]?.tier ?? 0;
          const alreadyHasBetter = playerTier >= toolStatus.tier;

          return (
            <button
              key={`buy-${entry.tool}`}
              disabled={!playerCanAfford || alreadyHasBetter}
              onClick={() => handleBuyFromNPC(entry)}
              style={{ marginRight: "0.5rem" }}
            >
              Buy {tierName} {entry.tool} (<CurrencyDisplay amount={entry.price} />)
            </button>
          );
        })}
        <button onClick={() => setEncounter("exit")} style={{ marginRight: "0.5rem" }}>
          Leave
        </button>
      </div>
    </div>
  );
};

export default NPCInteractionView;
