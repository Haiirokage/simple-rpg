import { ENCOUNTER_FRAMES } from "../../data/encounters/definitions";
import { useHandleEncounter, useSetEncounter } from "../../data/encounters/hooks";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { useNPCs, useMutateNPCs } from "../../npc/npc-hooks";
import type { HumanInstance } from "../../npc/npc-types";
import type { BudgetEntry, ToolSellEntry, ResourceSellEntry } from "../../npc/human-definitions";
import CurrencyDisplay from "../../components/CurrencyDisplay";
import { useHandleExploration } from "../../data/exploration/hooks";
import { mergeNumericRecords } from "../../util";

const NPCInteractionView = () => {
  const { exploration, mutateExploration } = useHandleExploration();
  const { encounter } = useHandleEncounter();
  const setEncounter = useSetEncounter();
  const npcs = useNPCs();
  const mutateNPCs = useMutateNPCs();
  const equipment = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();

  const inventory = exploration.inventory;

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
    mutateExploration({
      inventory: mergeNumericRecords(inventory, { [entry.resource]: -1, coin: entry.price }),
    });
    updateNPC({
      resources: {
        ...npc.resources,
        coin: npcIronScribble - entry.price,
        [entry.resource]: (npc.resources[entry.resource] ?? 0) + 1,
      },
    });
  };

  const handleBuyToolFromNPC = (entry: ToolSellEntry) => {
    const toolStatus = npc.equipment[entry.tool];
    if (!toolStatus) return;

    mutateExploration({
      inventory: mergeNumericRecords(inventory, { coin: -entry.price }),
    });
    mutateSpecific("tools", { [entry.tool]: { ...toolStatus } });
    updateNPC({
      resources: {
        ...npc.resources,
        coin: npcIronScribble + entry.price,
      },
      equipment: { ...npc.equipment, [entry.tool]: undefined },
      sellList: npc.sellList.filter((s) => s.type !== "tool" || s.tool !== entry.tool),
    });
  };

  const handleBuyResourceFromNPC = (entry: ResourceSellEntry) => {
    mutateExploration({
      inventory: mergeNumericRecords(inventory, { coin: -entry.price, [entry.resource]: 1 }),
    });
    updateNPC({
      resources: {
        ...npc.resources,
        coin: npcIronScribble + entry.price,
      },
      sellList: npc.sellList.map((s) =>
        s.type === "resource" && s.resource === entry.resource ? { ...s, stock: s.stock - 1 } : s,
      ),
    });
  };

  const playerCoin = inventory.coin ?? 0;

  return (
    <div>
      <h2>{frame.title}</h2>
      <p>{frame.description}</p>
      <p style={{ opacity: 0.7 }}>
        Your coin: <CurrencyDisplay amount={playerCoin} />
      </p>
      <div style={{ marginTop: "1rem" }}>
        {npc.budget.map((entry) => {
          const playerHas = (inventory[entry.resource] ?? 0) >= 1;
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
          if (entry.type === "tool") {
            const toolStatus = npc.equipment[entry.tool];
            if (!toolStatus) return null;
            const tierName = TOOL_DEFINITIONS[entry.tool].tiers[toolStatus.tier]?.name ?? "";
            const playerCanAfford = playerCoin >= entry.price;
            const playerTier = equipment.tools[entry.tool]?.tier ?? 0;
            const alreadyHasBetter = playerTier >= toolStatus.tier;

            return (
              <button
                key={`buy-${entry.tool}`}
                disabled={!playerCanAfford || alreadyHasBetter}
                onClick={() => handleBuyToolFromNPC(entry)}
                style={{ marginRight: "0.5rem" }}
              >
                Buy {tierName} {entry.tool} (<CurrencyDisplay amount={entry.price} />)
              </button>
            );
          }

          if (entry.type === "resource") {
            const playerCanAfford = playerCoin >= entry.price;
            const inStock = entry.stock > 0;

            return (
              <button
                key={`buy-${entry.resource}`}
                disabled={!playerCanAfford || !inStock}
                onClick={() => handleBuyResourceFromNPC(entry)}
                style={{ marginRight: "0.5rem" }}
              >
                Buy {entry.resource} (<CurrencyDisplay amount={entry.price} />)
                {entry.stock > 0 && ` [${entry.stock}]`}
              </button>
            );
          }

          return null;
        })}
        <button onClick={() => setEncounter("exit")} style={{ marginRight: "0.5rem" }}>
          Leave
        </button>
      </div>
    </div>
  );
};

export default NPCInteractionView;
