import { useCallback, useLayoutEffect, useMemo, useState } from "preact/hooks";
import styled from "styled-components";
import type { CreatureInstance } from "../../npc/creature-definitions";
import type { WeaponType } from "../../data/equipment/types";
import { objectEntries } from "../../util";
import {
  type ActionMode,
  type AgentState,
  type CombatEvent,
  type PerceivedWeapon,
  type WeaponPos,
  ENEMY_NOTICE_MS,
  ENEMY_SPEED,
  GUARD_POSITIONS,
  PLAYER_NOTICE_MS,
  PLAYER_SPEED,
  doSetGuard,
  forwardPos,
  hitDist,
  inferGuard,
  popAndPushMany,
  posEq,
  toDisplay,
} from "./combat-util";

const useWeaponState = (initialPos: WeaponPos, speed: number, noticeMs: number): AgentState => {
  const [pos, setPos] = useState<WeaponPos>(initialPos);
  const [target, setTarget] = useState<WeaponPos>(initialPos);

  const advance = useCallback(
    (elapsedMs: number) => {
      setPos((prev) => forwardPos(elapsedMs, prev, target, speed));
    },
    [target, speed],
  );

  return useMemo(
    () => ({ pos, target, advance, setTarget, speed, noticeMs }),
    [pos, target, advance, speed, noticeMs],
  );
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
  color?: string;
}>`
  position: absolute;
  width: ${(p) => 13 * p.extension}px;
  height: ${(p) => 13 * p.extension}px;
  background: rgba(255, 255, 255, ${(p) => 1 - p.extension});
  border: ${(p) => 4 - 3 * p.extension}px solid ${(p) => p.color ?? "black"};
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

const MeleeCombat = ({ weaponType: _ }: Props) => {
  const [time, setTime] = useState(0);
  const [actionMode, setActionMode] = useState<ActionMode>("guard");
  const player = useWeaponState(GUARD_POSITIONS.high, PLAYER_SPEED, PLAYER_NOTICE_MS);
  const enemy = useWeaponState(GUARD_POSITIONS.high, ENEMY_SPEED, ENEMY_NOTICE_MS);
  const [events, setEvents] = useState<CombatEvent[]>([]);
  const [perceivedPlayer, setPerceivedPlayer] = useState<PerceivedWeapon | null>(null);
  const [perceivedEnemy, setPerceivedEnemy] = useState<PerceivedWeapon | null>(null);

  const nextEvent = events[0];
  const nextAgent = nextEvent?.agent ?? "player";
  console.log(events);

  useLayoutEffect(() => {
    if (!nextEvent) return;
    const elapsed = nextEvent.time - time;
    if (elapsed > 0) {
      player.advance(elapsed);
      enemy.advance(elapsed);
    }
    setTime(nextEvent.time);
    if (nextEvent.type === "notice") {
      if (nextEvent.agent === "player") setPerceivedEnemy(nextEvent.snapshot);
      if (nextEvent.agent === "enemy") setPerceivedPlayer(nextEvent.snapshot);
    }
  }, [nextEvent]);

  const handlePlayerAction = (guardPos: WeaponPos) => {
    if (nextAgent !== "player") return;
    const isAttack = actionMode === "attack";
    const target = isAttack ? { ...guardPos, extension: 1 } : guardPos;
    const sameTarget = posEq(target, player.target);
    const snapshot: PerceivedWeapon = {
      pos: player.pos,
      apparentTarget: inferGuard(player.pos, target),
    };
    const { noticeMs, moveDuration } = doSetGuard(player, enemy, target);
    setEvents(
      popAndPushMany(
        sameTarget
          ? []
          : [
              { time: time + noticeMs, agent: "enemy", type: "notice", snapshot },
              { time: time + moveDuration, agent: "player", type: isAttack ? "hit" : "arrival" },
            ],
      ),
    );
  };

  const handleEnemyTurn = () => {
    if (nextAgent !== "enemy") return;
    const apparentPlayerTarget = perceivedPlayer?.apparentTarget ?? GUARD_POSITIONS.high;
    const enemyTarget = { ...apparentPlayerTarget, extension: 0 };
    const snapshot: PerceivedWeapon = {
      pos: enemy.pos,
      apparentTarget: inferGuard(enemy.pos, enemyTarget),
    };
    const { noticeMs, moveDuration } = doSetGuard(enemy, player, enemyTarget);
    setEvents(
      popAndPushMany(
        posEq(enemyTarget, enemy.target)
          ? []
          : [
              { time: time + noticeMs, agent: "player", type: "notice", snapshot },
              { time: time + moveDuration, agent: "enemy", type: "arrival" },
            ],
      ),
    );
  };

  //const atGuard = (pos: WeaponPos) => posEq(player.pos, pos);

  const renderTip = (pos: WeaponPos, color?: string) => {
    const { x, y } = toDisplay(pos);
    return <WeaponTip x={x} y={y} extension={pos.extension} color={color} />;
  };

  return (
    <>
      <div style={{ display: "flex", gap: "8px" }}>
        <WeaponPlane>
          {renderTip(player.pos)}
          {perceivedPlayer && renderTip(perceivedPlayer.pos, "red")}
          {perceivedPlayer && renderTip(perceivedPlayer.apparentTarget, "green")}
        </WeaponPlane>
        <WeaponPlane>
          {renderTip(enemy.pos)}
          {perceivedEnemy && renderTip(perceivedEnemy.pos, "red")}
          {perceivedEnemy && renderTip(perceivedEnemy.apparentTarget, "green")}
        </WeaponPlane>
      </div>
      <ActionRow>
        <select
          value={actionMode}
          onChange={(e) => setActionMode(e.currentTarget.value as ActionMode)}
        >
          <option value="guard">Guard</option>
          <option value="attack">Attack</option>
          <option value="feint">Feint</option>
        </select>
        {objectEntries(GUARD_POSITIONS).map(([dir, weaponPos]) => (
          <button
            key={dir}
            disabled={nextAgent !== "player"}
            onClick={() => handlePlayerAction(weaponPos)}
          >
            {dir.charAt(0).toUpperCase() + dir.slice(1)}
          </button>
        ))}
      </ActionRow>
      {nextEvent?.type === "hit" && nextEvent.agent === "player" && (
        <p>Hit distance: {hitDist(player.pos, enemy.pos).toFixed(3)}</p>
      )}
      <ActionRow>
        <button disabled={nextAgent !== "enemy"} onClick={handleEnemyTurn}>
          Enemy turn
        </button>
      </ActionRow>
    </>
  );
};

export default MeleeCombat;
