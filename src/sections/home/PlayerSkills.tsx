import { useSkills } from "../../data/skills/hooks";
import { objectEntries } from "../../util";
import styled from "styled-components";
import { useMemo } from "preact/hooks";
import type { Skills } from "../../data/skills/types";
import { getExpThreshold } from "../../data/leveling-util";

const SKILL_COLORS: Record<Skills, string> = {
  hunter: "#2ecc71",
  ranged: "#3498db",
  crafting: "#777777",
};

const SkillBox = styled.div`
  border: 1px solid #333;
  border-radius: 3px;
  background-color: #fff;
  font-weight: 500;
  overflow: hidden;

  & > div:first-child {
    padding: 4px 28px;
  }
`;

const ExperienceBar = styled.div<{ color: string }>`
  height: 4px;
  background-color: #f0f0f0;
  border-top: 1px solid #eee;
  overflow: hidden;

  & > div {
    height: 100%;
    background-color: ${(props) => props.color};
  }
`;

const PlayerSkills = () => {
  const { skills } = useSkills();

  const skillEntries = useMemo(() => objectEntries(skills), [skills]);

  return (
    <div>
      <h2>Skills</h2>
      {skillEntries.map(([name, skill]) => {
        if (skill.level === 0) {
          return null;
        }
        const expThreshold = getExpThreshold(skill.level);
        const expProgress = (skill.exp / expThreshold) * 100;

        return (
          <SkillBox key={name}>
            <div>
              {name.charAt(0).toUpperCase() + name.slice(1)}: {skill.level}
            </div>
            <ExperienceBar color={SKILL_COLORS[name]}>
              <div style={{ width: `${expProgress}%` }} />
            </ExperienceBar>
          </SkillBox>
        );
      })}
    </div>
  );
};

export default PlayerSkills;
