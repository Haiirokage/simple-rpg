import { useAttributes } from "../../data/attributes/hooks";
import styled from "styled-components";

const AttributeBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
  font-weight: 500;
  overflow: hidden;

  & > div:first-child {
    padding: 4px 28px;
  }
`;

const ExperienceBar = styled.div`
  height: 4px;
  background-color: #f0f0f0;
  border-top: 1px solid #eee;
  overflow: hidden;

  & > div {
    height: 100%;
    background-color: #ff6b6b;
  }
`;

const PlayerAttributes = () => {
  const { attributes } = useAttributes();
  const strength = attributes.strength;

  const expThreshold = Math.pow(1.4, strength.level);
  const expProgress = (strength.exp / expThreshold) * 100;

  return (
    <div>
      <h2>Attributes</h2>
      <AttributeBox>
        <div>Strength: {strength.level}</div>
        <ExperienceBar>
          <div style={{ width: `${expProgress}%` }} />
        </ExperienceBar>
      </AttributeBox>
    </div>
  );
};

export default PlayerAttributes;
