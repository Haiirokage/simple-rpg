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
