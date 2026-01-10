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
