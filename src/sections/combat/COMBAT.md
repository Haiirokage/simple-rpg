# Melee Combat Design

## Guard directions

Positions: **high**, **left**, **right**, **low**

- **Matching guard**: ~85% block chance (strength + skill affect this)
- **Mismatched guard**: 100% hit chance
- Moving your guard has a delay — you are not instantly in the new position

---

## The reaction chain

Combat is not a simultaneous exchange. Each action opens a timed reaction window for the opponent, which in turn opens one for the attacker, and so on.

**Example sequence:**

1. Player holds **high guard**, opponent holds **low guard**
2. Player wins initiative and attacks down from **high**
3. Opponent begins moving guard up — delay determined by their **dexterity + skill**
4. If opponent's guard arrives in time: block resolves based on **strength + skill** of both and distance traveled
5. Player's weapon gets deflected to the side — opponent now has an attack window
6. Opponent defended upwards and therefore is in high guard. Opponent thrusts to the face — player begins reacting, delay from **dexterity + skill**
7. If opponent's thrust was too slow (committed too late): player's block easily dispaces the thrust.
8. Because the opponent is over extended and the player has his weapon ready, the player gets an easy window to counter trust.

The crucial moment is the opponent's thrust. Superior skill and timing = critical hit on the player.
Too slow = player lands the critical counter instead.

---

## Initiative

Who attacks first in an exchange is determined by **dexterity + skill**. A slight edge in initiative can
flip who gets the critical window.

---

## Weapon position

Each combatant's weapon has a continuous 3D state:

- **Lateral** — left to right (-1 to +1)
- **Vertical** — low to high (-1 to +1)
- **Extension** — retracted to fully extended (0 to 1)

Guard directions are targets on the lateral/vertical plane. Moving guard means the weapon is
traveling toward that target; you are never instantly there. Transition cost is the geometric
distance between where the weapon is and where the next move needs it to start — this is what makes
combos flow or not flow.

**Extension** is the hidden axis. It accrues as debt and bleeds off passively:
- **Thrust**: rapidly drives extension toward 1; momentum carries it there
- **Cut/strike**: briefly extends but the return arc is part of the motion — the weapon comes back
- **Deflect**: lateral redirection, extension stays low

Extension matters because of leverage: a retracted weapon has full mechanical advantage; an extended
one can be levered against you. You must extend to reach the opponent — that tradeoff is unavoidable.

**The ideal defensive outcome** is deflecting an incoming attack without incurring your own extension:
- Opponent fully extended from their attack
- Defender at near-zero extension and free to move
- Opponent cannot attack again until they retract
- Defender can strike immediately

This is why deflection is mechanically superior to blocking when executed well. A block absorbs force
by opposing it, which requires bracing — some extension of your own. A deflect redirects laterally
and keeps the weapon close.

**Over-extension** leaves you unable to use your weapon effectively — but you can still dodge.
Dodging and weapon-based defense are parallel options; when one is unavailable the other remains.

---

## Critical hits

A critical hit occurs when you land a strike while the opponent is **exposed**: weapon over-extended,
guard mid-move, or weapon displaced by a deflect. In geometric terms: their extension is high and
yours is low, or their weapon is far from where it needs to be to block.

A critical from the opponent is the main thing the player is trying to avoid; landing one on the
opponent is the reward for good timing.

This kind of hit is a clean hit without any diminishing factors. It is not some special effect —
the consequence is simply that nothing absorbed or deflected the blow.

---

## Stamina

- Taking a clean hit: costs health + stamina
- Blocking (absorbing force): costs stamina
- **Deflecting** (redirecting force): costs less stamina, keeps extension low, and opens a counter window
- Swinging: costs stamina, more for heavy/committed attacks

The efficient fighter baits attacks and deflects to tire the opponent rather than trading blows.
Matching your opponent's guard and banking on strength works but is stamina-expensive.

---

## Timing as the core skill

The player's decisions are:
- **When to change guard** — early = opponent can read and redirect; late = risk of partial block
- **When to attack** — committing at the wrong time means you're extended when the counter comes
- **Deflect vs block** — deflect is riskier (requires correct timing) but keeps extension low and
  creates a counter window that a block never could
- **Dodge vs weapon defense** — when over-extended, dodging is the fallback

**Dexterity** determines reaction timings.
**Strength** determines speed, damage, defence and penetration
**Skill** determines muscle memory, fight intution, and how well you manuver your weapon.

---

## NPC combination attacks

Each NPC has a finite list of **combination attacks** — named sequences of moves they execute in order.

Example combo: `["move to low guard", "thrust", "attack from right"]`

The player sees each move as it happens and has a reaction window between moves. A player who has
learned this combo can pre-position on move 1, knowing moves 2 and 3 are coming.

**Why deflection direction matters:**
Deflecting the thrust to the right leaves the player's weapon already tracking right, making the
follow-up attack from the right much easier to handle. Deflecting to the left leaves the player out
of position — the combo lands as intended. Same event, different outcome based on knowledge and choice.

**Combo selection:**
The NPC weights its combo list by situation — a combo starting with "move to low guard" scores higher
when the player is holding high. Fatigued NPCs prefer shorter combos. This gives personality without
true AI.

**Feints:**
A move that mimics the opening of one combo but branches into another. Countered by patience
(don't commit until confirmed) rather than pure speed. Recognised and named techniques the player
can learn.

**Interrupted combos:**
If the NPC is hit or disrupted mid-combo, skilled NPCs push through; beginners abort and reset.
Landing a good deflect is rewarded even if you didn't fully stop the move.

**Data shape (sketch):**
```
ComboMove:
  | { type: "guard", direction: GuardDirection }
  | { type: "attack", direction: GuardDirection, mode: AttackMode }
  | { type: "feint", direction: GuardDirection }

CombinationAttack:
  id: string
  moves: ComboMove[]
  preferredWhen?: GuardDirection   // player guard that makes this combo attractive
```

---

## Stances (future)

A stance bundles a default guard with preferred attack directions and movement tendencies.
Changing stance is a deliberate, costly action — not something done mid-exchange.

## Footwork (future)

Footwork shifts distance and angle. Closing range changes which attacks are available and effective.
Retreating can reset the exchange and give recovery time.