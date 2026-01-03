import { useAttributes } from "../../data/attributes/hooks";
import { objectEntries } from "../../util";
import styled from "styled-components";
import { useMemo } from "preact/hooks";
import type { Attributes } from "../../data/attributes/types";

const ATTRIBUTE_COLORS: Record<Attributes, string> = {
  strength: "#ff6b6b",
  constitution: "#4a90e2",
};

const AttributeBox = styled.div`
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

const PlayerAttributes = () => {
  const { attributes } = useAttributes();

  const attributeEntries = useMemo(() => objectEntries(attributes), [attributes]);

  return (
    <div>
      <h2>Attributes</h2>
      {attributeEntries.map(([name, attribute]) => {
        const expThreshold = Math.pow(1.4, attribute.level);
        const expProgress = (attribute.exp / expThreshold) * 100;

        return (
          <AttributeBox key={name}>
            <div>
              {name.charAt(0).toUpperCase() + name.slice(1)}: {attribute.level}
            </div>
            <ExperienceBar color={ATTRIBUTE_COLORS[name]}>
              <div style={{ width: `${expProgress}%` }} />
            </ExperienceBar>
          </AttributeBox>
        );
      })}
    </div>
  );
};

export default PlayerAttributes;
