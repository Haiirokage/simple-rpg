import styled from "styled-components";
import type { CreatureInstance } from "../../npc/creature-definitions";
import { objectEntries, usePrevious } from "../../util";
import { useState } from "preact/hooks";
import DistanceBar from "./DistanceBar";
import {
  useSetEncounter,
  useUpdateEnemies,
  useHandleEncounter,
  useHandleSkillCheck,
} from "../../data/encounters/hooks";
import { useGrantAcuityExp } from "../../data/acuity/hooks";
import { useHandleExploration } from "../../data/exploration/hooks";
import { useHandleEquipment } from "../../data/equipment/hooks";
import type { WeaponType } from "../../data/equipment/types";
import { useAttributes } from "../../data/attributes/hooks";
import { useHandlePlayerStatus } from "../../data/playerStatus/hooks";
import TooltipWrapper from "../../style/TooltipWrapper";
import CombatResolution from "./CombatResolution";
import EnemyCard from "./EnemyCard";
import RangedCombat from "./RangedCombat";
import MeleeCombat from "./MeleeCombat";

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
`;

interface Props {
  enemies: Record<string, CreatureInstance>;
}

const CombatView = ({ enemies }: Props) => {
  const updateEnemies = useUpdateEnemies();
  const setEncounter = useSetEncounter();
  const { encounter, mutateEncounter } = useHandleEncounter();
  const { getWeaponStats } = useHandleEquipment();
  const { exploration } = useHandleExploration();
  const handleSkillCheck = useHandleSkillCheck(exploration.biome);
  const { playerStatus, updatePlayerStatus } = useHandlePlayerStatus();
  const { attributes } = useAttributes();
  const grantAcuityExp = useGrantAcuityExp();

  const combatContext = encounter.combatContext;
  const sparringWeapon = combatContext?.sparring?.weapon;
  const [selectedEnemy, setSelectedEnemy] = useState(Object.keys(enemies)[0]);
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponType>(sparringWeapon ?? "bow");

  const bowStats = getWeaponStats("bow");
  const bowRange = bowStats?.class === "projectile" ? (bowStats.tier?.range ?? 0) : 0;
  const enemy = selectedEnemy ? enemies[selectedEnemy] : undefined;
  const enemyEntries = objectEntries(enemies);
  const allDead = enemyEntries.every(([, e]) => e.health <= 0);
  const aware = enemyEntries.some(([, e]) => e.discovered);
  const anyHostile = enemyEntries.some(([, e]) => e.hostile);
  const outOfRange = enemy && enemy.health > 0 && enemy.distance > bowRange;
  const canLeave = !anyHostile || !!combatContext?.sparring;

  const prevAllDead = usePrevious(allDead);
  if (allDead && !prevAllDead) {
    const acuityExp = anyHostile ? 50 : 10;
    grantAcuityExp("combat", acuityExp);
    console.info(`Combat acuity +${acuityExp}`);
  }

  const handleTrack = (target: CreatureInstance) => {
    const dc = Math.floor(Math.sqrt(target.distance / 8));
    const closedDistance = target.distance - 100;
    const playerSpeed = Math.cbrt(attributes.dexterity.level) / 2;
    const trackingSeconds = closedDistance / playerSpeed;
    const trackingMinutes = Math.round(trackingSeconds / 60);
    const result = handleSkillCheck({ skill: ["hunter"], knowledge: true, dc });

    if (result === "success") {
      updateEnemies([{ id: target.id, distance: 100 }]);
      mutateEncounter({ timePassed: encounter.timePassed + trackingMinutes });
      updatePlayerStatus({ energy: -Math.ceil((trackingMinutes * 5) / 60) });
    } else {
      setEncounter("exit", trackingMinutes + 30, combatContext?.exitMessage);
    }
  };

  const sneakDistance = 20;
  const getSneakDC = (targetDistance: number) => Math.round(19 - targetDistance / 9);

  const handleSneak = (target: CreatureInstance) => {
    const targetDistance = target.distance - sneakDistance;
    const dc = getSneakDC(targetDistance);
    const result = handleSkillCheck({ skill: ["stealth"], knowledge: true, dc });

    if (result === "success") {
      updateEnemies([{ id: target.id, distance: targetDistance }]);
      mutateEncounter({ timePassed: encounter.timePassed + 2 });
    } else {
      updateEnemies([{ id: target.id, discovered: true }]);
    }
  };

  if (playerStatus.health <= 0) {
    return (
      <>
        <p>You have been slain.</p>
        <button onClick={() => setEncounter("exit", 0)}>Accept your fate</button>
      </>
    );
  }

  if (allDead) {
    return <CombatResolution enemies={enemies} combatContext={combatContext} />;
  }

  const weaponStats = getWeaponStats(selectedWeapon);

  return (
    <>
      {combatContext?.flavorText && (
        <p>
          {combatContext.flavorText}
          {!aware && " It hasn't noticed you yet."}
        </p>
      )}
      <DistanceBar enemies={enemies} selectedEnemy={selectedEnemy} />
      <div>
        {enemyEntries.map(([id, e]) => (
          <EnemyCard
            key={id}
            id={id}
            enemy={e}
            selected={id === selectedEnemy}
            onSelect={() => setSelectedEnemy(id)}
          />
        ))}
      </div>
      <ActionRow>
        <select
          value={selectedWeapon}
          disabled={!!sparringWeapon}
          onChange={(e) => setSelectedWeapon(e.currentTarget.value as WeaponType)}
        >
          <option value="bow">Bow</option>
          <option value="staff">Staff</option>
        </select>
      </ActionRow>
      {enemy && weaponStats?.class === "projectile" && <RangedCombat enemy={enemy} />}
      {enemy && weaponStats?.class === "melee" && (
        <MeleeCombat enemy={enemy} weaponType={selectedWeapon} />
      )}
      <ActionRow>
        {!aware && enemy && (
          <TooltipWrapper
            description={`Sneak to ${enemy.distance - sneakDistance}m (DC ${getSneakDC(enemy.distance - sneakDistance)})`}
            inline
          >
            <button onClick={() => handleSneak(enemy)}>Sneak closer</button>
          </TooltipWrapper>
        )}
        {outOfRange && aware && enemy && !anyHostile && (
          <button onClick={() => handleTrack(enemy)}>Track</button>
        )}
      </ActionRow>
      <ActionRow>
        {canLeave && (
          <button onClick={() => setEncounter("exit", 10, combatContext?.exitMessage)}>
            {combatContext?.sparring || outOfRange ? "Give up" : "Flee"}
          </button>
        )}
      </ActionRow>
    </>
  );
};

export default CombatView;
