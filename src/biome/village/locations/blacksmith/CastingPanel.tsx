import { useState } from "preact/hooks";
import { useHandleExploration } from "../../../../data/exploration/hooks";
import { useHandlePlayerStatus } from "../../../../data/playerStatus/hooks";
import { useAdvanceTime } from "../../../../data/time/hooks";
import { matchMold } from "../../../../data/craftComponents/definitions";
import { mergeNumericRecords } from "../../../../util";
import MoldGrid from "./MoldGrid";

const GRID_SIZE = 9;
const emptyGrid = (): boolean[][] =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));

const PREPARE_ENERGY_COST = 5;
const PREPARE_TIME_COST = 1;

type Props = { onCancel: () => void };

const CastingPanel = ({ onCancel }: Props) => {
  const [grid, setGrid] = useState(emptyGrid);
  const [moldPrepared, setMoldPrepared] = useState(false);
  const { exploration, mutateExploration } = useHandleExploration();
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const advanceTime = useAdvanceTime();

  const matchedCast = matchMold(grid);
  const carryBars = exploration.craftComponents.bar.copper;
  const charcoal = exploration.inventory.charcoal ?? 0;
  const barCost = matchedCast?.barCost ?? 0;
  const canCast = matchedCast !== null && carryBars >= barCost && charcoal >= barCost;
  const canPrepare = playerStatus.energy >= PREPARE_ENERGY_COST;

  const handlePrepareMold = () => {
    updatePlayerStatus({ energy: -PREPARE_ENERGY_COST });
    advanceTime(PREPARE_TIME_COST);
    setGrid(emptyGrid());
    setMoldPrepared(true);
  };

  const handleGridChange = (newGrid: boolean[][]) => {
    setGrid((prev) => newGrid.map((row, r) => row.map((cell, c) => cell || prev[r][c])));
  };

  const handleCast = () => {
    if (!matchedCast) return;
    const { craftComponents } = exploration;
    const { type } = matchedCast;
    mutateExploration({
      inventory: mergeNumericRecords(exploration.inventory, { charcoal: -barCost }),
      craftComponents: {
        ...craftComponents,
        bar: { type: "metal", copper: craftComponents.bar.copper - barCost },
        [type]: { type: "metal", copper: craftComponents[type].copper + 1 },
      },
    });
    setGrid(emptyGrid());
    setMoldPrepared(false);
  };

  return (
    <div>
      {moldPrepared ? (
        <>
          <MoldGrid grid={grid} onChange={handleGridChange} />
          {matchedCast ? (
            <p>
              {matchedCast.label} — Cost: {barCost} copper {barCost === 1 ? "bar" : "bars"},{" "}
              {barCost} charcoal
            </p>
          ) : (
            <p>Draw a mold to identify the cast</p>
          )}
          <button disabled={!canCast} onClick={handleCast}>
            Cast
          </button>
          <button onClick={() => setMoldPrepared(false)}>Discard mold</button>
        </>
      ) : (
        <>
          <p>No mold prepared.</p>
          <button disabled={!canPrepare} onClick={handlePrepareMold}>
            Prepare mold ({PREPARE_ENERGY_COST} energy, {PREPARE_TIME_COST}h)
          </button>
        </>
      )}
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CastingPanel;
