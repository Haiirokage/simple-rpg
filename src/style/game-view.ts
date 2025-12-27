import styled from "styled-components";

export const GameSection = styled.section<{ area?: string }>`
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
  background-color: #fafafa;
  ${(props) => (props.area ? `grid-area: ${props.area};` : "")}

  h2 {
    margin: 0 0 8px;
  }
`;

export const GameViewContainer = styled.div<{ templateAreas?: string; templateColumns?: string }>`
  padding: 8px;
  display: grid;
  ${(props) => (props.templateColumns ? `grid-template-columns: ${props.templateColumns};` : "")}
  ${(props) => (props.templateAreas ? `grid-template-areas: ${props.templateAreas};` : "")}
  gap: 12px;
  width: fit-content;
`;
