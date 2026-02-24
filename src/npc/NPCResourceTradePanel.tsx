import { useState } from "preact/hooks";
import styled from "styled-components";
import { useHandleExploration } from "../data/exploration/hooks";
import { mergeNumericRecords } from "../util";
import CurrencyDisplay from "../components/CurrencyDisplay";
import { npcBuyPrice, npcSellPrice, useHandleNPCs } from "./npc-hooks";
import type { HumanInstance } from "./npc-types";
import { resourceRecord, type ResourceCost, type ResourceKeys } from "../data/resources/types";

const TRADE_TRUST_CAP = 10;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  div {
    display: grid;
    grid-template-columns: 2.5rem 2rem 1fr 2rem 2.5rem;
    gap: 0.25rem 0.4rem;
    align-items: center;
    text-align: center;
  }

  .header {
    font-size: 0.8rem;
    text-align: center;

    .yours {
      grid-column: 1 / 3;
    }
    .theirs {
      grid-column: 4 / 6;
    }
  }

  .footer {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.25rem;
    border-top: 1px solid #444;
    text-align: left;

    .net {
      flex: 1;
      font-size: 0.9rem;
    }
  }
`;

interface Props {
  npc: HumanInstance;
  onTrade?: () => void;
  onCancel?: () => void;
}

const NPCResourceTradePanel = ({ npc, onTrade, onCancel }: Props) => {
  const { exploration, mutateExploration } = useHandleExploration();
  const { mutateNPC } = useHandleNPCs();
  const inventory = exploration.inventory;

  const [selling, setSelling] = useState(resourceRecord);
  const [buying, setBuying] = useState(resourceRecord);

  const npcCoin = npc.resources.coin ?? 0;
  const playerCoin = inventory.coin ?? 0;

  const visibleEntries = npc.interests;

  if (visibleEntries.length === 0) return null;

  const onTradeClick = (r: ResourceKeys, buy: boolean) => {
    const opposite = buy ? selling : buying;
    const setOpposite = buy ? setSelling : setBuying;
    const setSelf = buy ? setBuying : setSelling;
    if (opposite[r] > 0) {
      setOpposite((prev) => ({ ...prev, [r]: prev[r] - 1 }));
    } else {
      setSelf((prev) => ({ ...prev, [r]: prev[r] + 1 }));
    }
  };

  const netCoin = visibleEntries.reduce((sum, entry) => {
    const r = entry.resource;
    return sum + selling[r] * npcBuyPrice(entry.value) - buying[r] * npcSellPrice(entry.value);
  }, 0);

  const coinValid = netCoin >= 0 ? npcCoin >= netCoin : playerCoin >= -netCoin;
  const hasPending = visibleEntries.some((e) => selling[e.resource] > 0 || buying[e.resource] > 0);

  return (
    <Panel>
      <div className="header">
        <span className="yours">Your inventory</span>
        <span />
        <span className="theirs">{npc.name}</span>
      </div>
      {visibleEntries.map((entry) => {
        const r = entry.resource;
        const playerQty = (inventory[r] ?? 0) - selling[r] + buying[r];
        const npcQty = (npc.resources[r] ?? 0) + selling[r] - buying[r];

        return (
          <div key={r}>
            <span>{playerQty}</span>
            <button disabled={playerQty <= 0} onClick={() => onTradeClick(r, false)}>
              {">"}
            </button>
            <span>{r}</span>
            <button disabled={npcQty <= 0} onClick={() => onTradeClick(r, true)}>
              {"<"}
            </button>
            <span>{npcQty}</span>
          </div>
        );
      })}
      <div className="footer">
        <span className="net">
          {netCoin >= 0 ? "+" : ""}
          <CurrencyDisplay amount={netCoin} />
        </span>
        {hasPending && (
          <button
            disabled={!coinValid}
            onClick={() => {
              const trustDelta = visibleEntries.reduce(
                (sum, e) =>
                  sum + selling[e.resource] * (e.value / 60) + buying[e.resource] * (e.value / 40),
                0,
              );
              const npcDelta: ResourceCost = {
                ...Object.fromEntries(
                  visibleEntries.map((e) => [e.resource, selling[e.resource] - buying[e.resource]]),
                ),
                coin: -netCoin,
              };
              const playerDelta: ResourceCost = {
                ...Object.fromEntries(
                  visibleEntries.map((e) => [e.resource, buying[e.resource] - selling[e.resource]]),
                ),
                coin: netCoin,
              };
              const newTrust = Math.min(TRADE_TRUST_CAP, npc.trust + trustDelta);
              mutateNPC(npc.id, {
                resources: mergeNumericRecords(npc.resources, npcDelta),
                trust: Math.max(newTrust, npc.trust),
              });
              mutateExploration({ inventory: mergeNumericRecords(inventory, playerDelta) });
              setSelling(resourceRecord);
              setBuying(resourceRecord);
              if (onTrade) onTrade();
            }}
          >
            Confirm
          </button>
        )}
        <button
          onClick={() => {
            setSelling(resourceRecord);
            setBuying(resourceRecord);
            onCancel?.();
          }}
        >
          Cancel
        </button>
      </div>
    </Panel>
  );
};

export default NPCResourceTradePanel;
