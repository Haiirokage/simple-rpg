import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import styled from "styled-components";
import type { CreatureInstance } from "../../npc/creature-definitions";
import type { WeaponType } from "../../data/equipment/types";
import { objectEntries } from "../../util";

type GuardDirection = "high" | "left" | "right" | "low";
type WeaponPos = { lateral: number; vertical: number; extension: number };
type AgentState = {
  pos: WeaponPos;
  target: WeaponPos;
  advance: (elapsedMs: number, newTarget?: WeaponPos) => void;
  speed: number;
  noticeMs: number;
};

const GUARD_POSITIONS: Record<GuardDirection, WeaponPos> = {
  high: { lateral: 0, vertical: 1, extension: 0 },
  left: { lateral: -1, vertical: 0, extension: 0 },
  right: { lateral: 1, vertical: 0, extension: 0 },
  low: { lateral: 0, vertical: -1, extension: 0 },
};

const PLAYER_SPEED = 0.003; // units per ms
const ENEMY_SPEED = 0.003;
const ENEMY_NOTICE_MS = 400; // placeholder — will come from enemy dex + skill
const PLAYER_NOTICE_MS = 300; // placeholder — will come from player dex + skill

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const posDist = (a: WeaponPos, b: WeaponPos) =>
  Math.hypot(b.lateral - a.lateral, b.vertical - a.vertical);

const forwardPos = (
  elapsedMs: number,
  pos: WeaponPos,
  target: WeaponPos,
  speed: number,
): WeaponPos => {
  const d = posDist(pos, target);
  if (d === 0) return pos;
  const t = Math.min(1, elapsedMs / (d / speed));
  return {
    lateral: lerp(pos.lateral, target.lateral, t),
    vertical: lerp(pos.vertical, target.vertical, t),
    extension: lerp(pos.extension, target.extension, t),
  };
};

const useWeaponState = (initialPos: WeaponPos, speed: number, noticeMs: number): AgentState => {
  const [pos, setPos] = useState<WeaponPos>(initialPos);
  const [target, setTarget] = useState<WeaponPos>(initialPos);

  const advance = useCallback(
    (elapsedMs: number, newTarget: WeaponPos = target) => {
      setPos((prev) => forwardPos(elapsedMs, prev, newTarget, speed));
      setTarget(newTarget);
    },
    [target, speed],
  );

  return useMemo(
    () => ({ pos, target, advance, speed, noticeMs }),
    [pos, target, advance, speed, noticeMs],
  );
};

const doSetGuard = (attacker: AgentState, defender: AgentState, target: WeaponPos) => {
  const moveDuration = posDist(attacker.pos, target) / attacker.speed;
  const forwardMs = Math.min(moveDuration, defender.noticeMs);
  attacker.advance(forwardMs, target);
  defender.advance(forwardMs);
};

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
`;

const WeaponPlane = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid #666;
  border-radius: 50%;
  margin-top: 8px;
`;

const WeaponTip = styled.div.withConfig({ shouldForwardProp: () => false })<{
  x: number;
  y: number;
  extension: number;
}>`
  position: absolute;
  width: ${(p) => 13 * p.extension}px;
  height: ${(p) => 13 * p.extension}px;
  background: rgba(255, 255, 255, ${(p) => 1 - p.extension});
  border: ${(p) => 4 - 3 * p.extension}px solid black;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  left: clamp(5px, ${(p) => p.x}%, calc(100% - 5px));
  top: clamp(5px, ${(p) => p.y}%, calc(100% - 5px));
  transition:
    left 0.15s,
    top 0.15s,
    width 0.15s,
    height 0.15s,
    background 0.15s,
    border 0.15s;
`;

interface Props {
  enemy: CreatureInstance;
  weaponType: WeaponType;
}

const toDisplay = (pos: WeaponPos) => ({
  x: ((pos.lateral + 1) / 2) * 100,
  y: ((1 - pos.vertical) / 2) * 100,
});

const MeleeCombat = ({ weaponType: _ }: Props) => {
  const player = useWeaponState(GUARD_POSITIONS.high, PLAYER_SPEED, PLAYER_NOTICE_MS);
  const enemy = useWeaponState(GUARD_POSITIONS.high, ENEMY_SPEED, ENEMY_NOTICE_MS);
  const [turn, setTurn] = useState<"player" | "enemy">("player");

  const display = toDisplay(player.pos);
  const enemyDisplay = toDisplay(enemy.pos);

  const handlePlayerGuard = (target: WeaponPos) => {
    if (turn !== "player") return;
    doSetGuard(player, enemy, target);
    setTurn("enemy");
  };

  useEffect(() => {
    if (turn !== "enemy") return;
    doSetGuard(enemy, player, player.target);
    setTurn("player");
  }, [turn, enemy, player]);

  const atGuard = (pos: WeaponPos) =>
    player.target.lateral === pos.lateral && player.target.vertical === pos.vertical;

  return (
    <>
      <div style={{ display: "flex", gap: "8px" }}>
        <WeaponPlane>
          <WeaponTip x={display.x} y={display.y} extension={player.pos.extension} />
        </WeaponPlane>
        <WeaponPlane>
          <WeaponTip x={enemyDisplay.x} y={enemyDisplay.y} extension={enemy.pos.extension} />
        </WeaponPlane>
      </div>
      <ActionRow>
        <span>Guard:</span>
        {objectEntries(GUARD_POSITIONS).map(([dir, weaponPos]) => (
          <button
            key={dir}
            disabled={atGuard(weaponPos)}
            onClick={() => handlePlayerGuard(weaponPos)}
          >
            {dir.charAt(0).toUpperCase() + dir.slice(1)}
          </button>
        ))}
      </ActionRow>
      <ActionRow>
        <button>Attack</button>
      </ActionRow>
    </>
  );
};

export default MeleeCombat;
