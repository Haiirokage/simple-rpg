import styled from "styled-components";

export const Paragraph = styled.p<{ margin?: string }>`
  margin: ${({ margin }) => margin || "0"};
`;
