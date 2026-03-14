import styled from "styled-components";

export const CostIndicator = styled.div`
  font-size: 0.8em;
  margin: 0 0.25rem;
  display: inline-flex;
  gap: 0.3rem;
`;

export const EnergyCircle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4169e1;
`;

const ClockFace = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid #666;
  position: relative;
`;

const ClockHand = styled.div<{ angle: number }>`
  width: 1px;
  background-color: #666;
  position: absolute;
  transform: translateX(-50%) rotate(${(props) => props.angle}deg);

  &:first-of-type {
    height: 5px;
    top: 2px;
    left: 8px;
  }

  &:last-of-type {
    height: 3px;
    top: 4px;
    left: 5px;
  }
`;

export const TimeCostIndicator = ({ timeCost }: { timeCost: number }) => (
  <CostIndicator>
    <span>{timeCost}</span>
    <ClockFace>
      <ClockHand angle={45} />
      <ClockHand angle={-45} />
    </ClockFace>
  </CostIndicator>
);
