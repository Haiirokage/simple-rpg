import { objectEntries } from "../../util";

export type GuardDirection = "high" | "left" | "right" | "low";
export type WeaponPos = { lateral: number; vertical: number; extension: number };
export type AgentState = {
  pos: WeaponPos;
  target: WeaponPos;
  advance: (elapsedMs: number) => void;
  setTarget: (newTarget: WeaponPos) => void;
  speed: number;
  noticeMs: number;
};

export type ActionMode = "guard" | "attack" | "feint";

// Frozen snapshot stored on notice events — what the observer sees at the moment of noticing
export type PerceivedWeapon = {
  pos: WeaponPos;
  apparentTarget: WeaponPos; // nearest guard in direction of movement
};

interface CombatEventBase {
  time: number;
  agent: "player" | "enemy";
}
export interface NoticeEvent extends CombatEventBase {
  type: "notice";
  snapshot: PerceivedWeapon;
}
export interface ArrivalEvent extends CombatEventBase {
  type: "arrival" | "hit";
}
export type CombatEvent = NoticeEvent | ArrivalEvent;

export const GUARD_POSITIONS: Record<GuardDirection, WeaponPos> = {
  high: { lateral: 0, vertical: 1, extension: 0 },
  left: { lateral: -1, vertical: 0, extension: 0 },
  right: { lateral: 1, vertical: 0, extension: 0 },
  low: { lateral: 0, vertical: -1, extension: 0 },
};

export const PLAYER_SPEED = 0.005; // units per ms
export const ENEMY_SPEED = 0.005;
export const ENEMY_NOTICE_MS = 100; // placeholder — will come from enemy dex + skill
export const PLAYER_NOTICE_MS = 75; // placeholder — will come from player dex + skill

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const posDist = (a: WeaponPos, b: WeaponPos) =>
  Math.hypot(b.lateral - a.lateral, b.vertical - a.vertical, b.extension - a.extension);

export const forwardPos = (
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

export const doSetGuard = (
  attacker: AgentState,
  defender: AgentState,
  target: WeaponPos,
): { noticeMs: number; moveDuration: number } => {
  const moveDuration = posDist(attacker.pos, target) / attacker.speed;
  const noticeMs = Math.min(moveDuration, defender.noticeMs);
  attacker.setTarget(target);
  return { noticeMs, moveDuration };
};

// Nearest guard in the direction of movement — what the observer infers as the destination
export const inferGuard = (from: WeaponPos, toward: WeaponPos): WeaponPos => {
  const d = posDist(from, toward);
  if (d === 0) return { ...from, extension: 0 };
  const scale = 10 / d;
  const projected = {
    lateral: from.lateral + (toward.lateral - from.lateral) * scale,
    vertical: from.vertical + (toward.vertical - from.vertical) * scale,
    extension: 0,
  };
  return objectEntries(GUARD_POSITIONS).reduce<WeaponPos>(
    (best, [, pos]) => (posDist(projected, pos) < posDist(projected, best) ? pos : best),
    GUARD_POSITIONS.high,
  );
};

export const popAndPushMany =
  (newEvents: CombatEvent[]) =>
  (prev: CombatEvent[]): CombatEvent[] => {
    const [, ...rest] = prev;
    const newArrival = newEvents.find((e) => e.type === "arrival" || e.type === "hit");
    const filtered = rest.filter(
      (e) => !(e.agent === newArrival?.agent && (e.type === "arrival" || e.type === "hit")),
    );
    return [...filtered, ...newEvents].sort((a, b) => a.time - b.time);
  };

export const posEq = (a: WeaponPos, b: WeaponPos) =>
  a.lateral === b.lateral && a.vertical === b.vertical && a.extension === b.extension;

export const toDisplay = (pos: WeaponPos) => ({
  x: ((pos.lateral + 1) / 2) * 100,
  y: ((1 - pos.vertical) / 2) * 100,
});

// Distance between weapon tips when facing each other — extension axes are opposed
export const hitDist = (attacker: WeaponPos, defender: WeaponPos) =>
  Math.hypot(
    attacker.lateral - defender.lateral,
    attacker.vertical - defender.vertical,
    1 - attacker.extension - defender.extension,
  );
