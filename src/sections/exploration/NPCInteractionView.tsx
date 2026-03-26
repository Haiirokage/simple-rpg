import { useState } from "preact/hooks";
import { useEquipment, useUpdateEquipment } from "../../data/equipment/hooks";
import { TOOL_DEFINITIONS } from "../../data/equipment/definitions";
import { useHandleNPCs } from "../../npc/npc-hooks";
import type { ToolSellEntry } from "../../npc/human-definitions";
import CurrencyDisplay from "../../components/CurrencyDisplay";
import { useHandleExploration } from "../../data/exploration/hooks";
import { mergeNumericRecords, objectEntries } from "../../util";
import { useHandleDiscoveries } from "../../data/discoveries/hooks";
import NPCResourceTradePanel from "../../npc/NPCResourceTradePanel";
import type { HumanInstance } from "../../npc/creature-types";
import { useHandleEncounter } from "../../data/encounters/hooks";
import type { LocationId } from "../../data/exploration/types";
import type { WeaponType } from "../../data/equipment/types";

const SPARRING_SUITABILITY: Partial<Record<LocationId, number>> = {
  abandoned_field: 45,
  lake: 30,
};

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
  const { mutateEncounter } = useHandleEncounter();

  const inventory = exploration.inventory;
  const npcCoin = npc.resources.coin ?? 0;
  const playerCoin = inventory.coin ?? 0;

  const sparringScore = (SPARRING_SUITABILITY[exploration.location as LocationId] ?? 0) + npc.trust;
  const sparringOptions = objectEntries(npc.definition.sparringThreshold ?? {})
    .filter(([weapon, threshold]) => sparringScore >= threshold && !!equipment.tools[weapon])
    .map(([weapon]) => weapon as WeaponType);

  const handleSpar = (weapon: WeaponType) => {
    mutateEncounter({
      active: true,
      enemies: { [npc.id]: { ...npc, hostile: true, distance: 30 } },
      combatContext: { flavorText: `${npc.name} takes a fighting stance.`, sparring: { weapon } },
    });
  };

  const triggerVillageRumor = () => {
    if (npc.definition.home?.biome === "village" && discoveries.village_rumor === 0) {
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

  const interactionTitle = title || npc.name;

  return (
    <div>
      {interactionTitle && <h2>{interactionTitle}</h2>}
      {description && <p>{description}</p>}
      <p>
        Coins: <CurrencyDisplay amount={npcCoin} />
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
            {Object.keys(npc.definition.interestValues).length > 0 && (
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
            {sparringOptions.map((weapon) => (
              <button
                key={weapon}
                onClick={() => handleSpar(weapon)}
                style={{ marginRight: "0.5rem" }}
              >
                Spar with {weapon}
              </button>
            ))}
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
