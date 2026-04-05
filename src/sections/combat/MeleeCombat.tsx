import { useState } from "preact/hooks";
import styled from "styled-components";
import type { CreatureInstance } from "../../npc/creature-definitions";
import type { WeaponType } from "../../data/equipment/types";

type GuardDirection = "high" | "left" | "right" | "low";

const GUARD_DIRECTIONS: GuardDirection[] = ["high", "left", "right", "low"];

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
`;

const GuardButton = styled.button<{ $selected: boolean }>`
  background-color: ${(props) => (props.$selected ? "#1d4ed8" : "")};
  color: ${(props) => (props.$selected ? "#fff" : "")};
`;

interface Props {
  enemy: CreatureInstance;
  weaponType: WeaponType;
}

const MeleeCombat = ({ enemy, weaponType: _ }: Props) => {
  const [guard, setGuard] = useState<GuardDirection>("high");

  return (
    <>
      <ActionRow>
        <span>Guard:</span>
        {GUARD_DIRECTIONS.map((dir) => (
          <GuardButton key={dir} $selected={guard === dir} onClick={() => setGuard(dir)}>
            {dir.charAt(0).toUpperCase() + dir.slice(1)}
          </GuardButton>
        ))}
      </ActionRow>
      <ActionRow>
        <button>Attack</button>
      </ActionRow>
    </>
  );
};

export default MeleeCombat;
