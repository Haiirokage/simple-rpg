import { useSkills } from "../../data/skills/hooks";
import { useAcuity } from "../../data/acuity/hooks";
import { objectEntries } from "../../util";
import styled from "styled-components";
import { useMemo } from "preact/hooks";
import type { Skills } from "../../data/skills/types";
import { getExpThreshold } from "../../data/leveling-util";
import TooltipWrapper from "../../style/TooltipWrapper";
import { getAttributeBySkill } from "../../data/skills/definitions";
import { getSkillBonus } from "../../data/encounters/util";
import { useAttributes } from "../../data/attributes/hooks";

const SKILL_COLORS: Record<Skills, string> = {
  hunter: "#2ecc71",
  ranged: "#3498db",
  crafting: "#777777",
  stealth: "#9b59b6",
  meditation: "#1abc9c",
  lore: "#ab47bc",
  mining: "#8d6e63",
  smithing: "#e74c3c",
};

const SkillBox = styled.div`
  border: 1px solid #333;
  border-radius: 3px;
  background-color: #fff;
  font-weight: 500;
  overflow: hidden;
  width: 175px;

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

const ACUITY_COLOR = "#e67e22";

const PlayerSkills = () => {
  const { skills } = useSkills();
  const { attributes } = useAttributes();
  const acuity = useAcuity();

  const skillEntries = useMemo(() => objectEntries(skills), [skills]);

  const combatAcuity = acuity.combat;
  const acuityThreshold = getExpThreshold(combatAcuity.level);
  const acuityProgress = (combatAcuity.exp / acuityThreshold) * 100;

  return (
    <div>
      <h2>Skills</h2>
      {skillEntries.map(([name, skill]) => {
        if (skill.level === 0) {
          return null;
        }
        const expThreshold = getExpThreshold(skill.level);
        const expProgress = (skill.exp / expThreshold) * 100;

        const attr = getAttributeBySkill(name);

        const bonus = getSkillBonus(skill.level);

        return (
          <TooltipWrapper
            description={`Bonus: ${bonus}+${Math.floor(attributes[attr].level / 20)}(${attr})   exp: ${Math.round(skill.exp)}/${expThreshold}`}
          >
            <SkillBox key={name}>
              <div>
                {name.charAt(0).toUpperCase() + name.slice(1)}: {skill.level}
              </div>
              <ExperienceBar color={SKILL_COLORS[name]}>
                <div style={{ width: `${expProgress}%` }} />
              </ExperienceBar>
            </SkillBox>
          </TooltipWrapper>
        );
      })}
      <hr />
      {combatAcuity.level > 0 && (
        <>
          <SkillBox>
            <div>Combat acuity: {combatAcuity.level}</div>
            <ExperienceBar color={ACUITY_COLOR}>
              <div style={{ width: `${acuityProgress}%` }} />
            </ExperienceBar>
          </SkillBox>
        </>
      )}
    </div>
  );
};

export default PlayerSkills;
