import styled from "styled-components";

export const Paragraph = styled.p<{ margin?: string }>`
  margin: ${({ margin }) => margin || "0"};
`;

export const Button = styled.button`
  display: block;
  font-size: 0.85em;
  padding: 2px 6px;
  font-family: inherit;

  &:disabled {
    cursor: not-allowed;
  }
`;

export const Header2 = styled.h2`
  margin: 4px 0 24px;
  font-size: 28px;
`;
export const Header3 = styled.h3`
  margin: 0 0 16px;
  font-size: 22px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;

export const SmallButton = styled.button`
  font-size: 11px;
  padding: 1px 4px;
`;
