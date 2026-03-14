import { useState } from "preact/hooks";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { useHandleNPCs } from "../../npc/npc-hooks";
import type { ToolSellEntry } from "../../npc/human-definitions";
import CurrencyDisplay from "../../components/CurrencyDisplay";
import { useHandleExploration } from "../../data/exploration/hooks";
import { mergeNumericRecords } from "../../util";
import { useHandleDiscoveries } from "../../data/discoveries/hooks";
import NPCResourceTradePanel from "../../npc/NPCResourceTradePanel";
import type { HumanInstance } from "../../npc/npc-types";

interface Props {
  npc: HumanInstance;
  onLeave: () => void;
  title?: string;
  description?: string;
}

const NPCInteractionView = ({ npc, onLeave, title, description }: Props) => {
  const [trading, setTrading] = useState(false);
  const { exploration, mutateExploration } = useHandleExploration();
  const { mutateNPC } = useHandleNPCs();
  const equipment = useEquipment();
  const { mutateSpecific } = useUpdateEquipment();
  const { discoveries, updateDiscovery } = useHandleDiscoveries();

  const inventory = exploration.inventory;
  const npcCoin = npc.resources.coin ?? 0;
  const playerCoin = inventory.coin ?? 0;

  const triggerVillageRumor = () => {
    if (npc.home?.biome === "village" && discoveries.village_rumor === 0) {
      updateDiscovery("village_rumor");
    }
  };

  const handleBuyToolFromNPC = (entry: ToolSellEntry) => {
    const toolStatus = npc.equipment[entry.tool];
    if (!toolStatus) return;

    triggerVillageRumor();
    mutateExploration({
      inventory: mergeNumericRecords(inventory, { coin: -entry.price }),
    });
    mutateSpecific("tools", { [entry.tool]: { ...toolStatus } });
    mutateNPC(npc.id, {
      resources: { ...npc.resources, coin: npcCoin + entry.price },
      equipment: { ...npc.equipment, [entry.tool]: undefined },
      sellList: npc.sellList.filter((s) => s.tool !== entry.tool),
    });
  };

  return (
    <div>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      <p>
        Your coin: <CurrencyDisplay amount={playerCoin} />
      </p>
      <div style={{ marginTop: "1rem" }}>
        {trading ? (
          <NPCResourceTradePanel
            npc={npc}
            onTrade={triggerVillageRumor}
            onCancel={() => setTrading(false)}
          />
        ) : (
          <>
            {Object.keys(npc.interestValues).length > 0 && (
              <button onClick={() => setTrading(true)} style={{ marginRight: "0.5rem" }}>
                Trade
              </button>
            )}
            {npc.sellList.map((entry) => {
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
            })}
            <button onClick={onLeave} style={{ marginRight: "0.5rem" }}>
              Leave
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NPCInteractionView;
