import { Fragment } from "preact";
import styled from "styled-components";
import { clamp } from "lodash";
import type { CreatureInstance } from "../../npc/creature-definitions";
import { getWoundStatus } from "../../combat/util";
import { objectEntries } from "../../util";

const RANGE = 150;

const toPercent = (distance: number) => clamp(((distance + RANGE) / (RANGE * 2)) * 100, 0, 100);

const WOUND_COLOR: Record<string, string> = {
  healthy: "#10b981",
  wounded: "#f59e0b",
  critical: "#ef4444",
};

const Bar = styled.div`
  position: relative;
  height: 60px;
  margin-bottom: 8px;
`;

const Track = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: #ddd;
  transform: translateY(-50%);
`;

const Dot = styled.div<{ $left: number; $color: string; $size: number; $selected?: boolean }>`
  position: absolute;
  left: ${(p) => p.$left}%;
  top: 50%;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  outline: ${(p) => (p.$selected ? "2px solid #1d4ed8" : "none")};
  outline-offset: 2px;
  transform: translate(-50%, -50%);
`;

const Label = styled.span<{ $left: number; $bottom?: boolean }>`
  position: absolute;
  left: ${(p) => p.$left}%;
  ${(p) => (p.$bottom ? "bottom: 4px" : "top: 4px")};
  transform: translateX(-50%);
  font-size: 10px;
  white-space: nowrap;
  color: ${(p) => (p.$bottom ? "#6b7280" : "inherit")};
`;

interface Props {
  enemies: Record<string, CreatureInstance>;
  selectedEnemy: string;
}

const DistanceBar = ({ enemies, selectedEnemy }: Props) => (
  <Bar>
    <Track />
    <Dot $left={50} $color="#374151" $size={12} />
    <Label $left={50}>You</Label>
    {objectEntries(enemies).map(([id, enemy]) => {
      const left = toPercent(enemy.distance);
      const color = WOUND_COLOR[getWoundStatus(enemy)];
      const selected = id === selectedEnemy;
      return (
        <Fragment key={id}>
          <Dot $left={left} $color={color} $size={selected ? 14 : 10} $selected={selected} />
          <Label $left={left}>{enemy.name}</Label>
          <Label $left={left} $bottom>
            {enemy.distance}m
          </Label>
        </Fragment>
      );
    })}
  </Bar>
);

export default DistanceBar;
