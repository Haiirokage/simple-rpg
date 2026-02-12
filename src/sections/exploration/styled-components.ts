import styled from "styled-components";

export const LookAroundButton = styled.button<{ hasViable: boolean }>`
  ${(props) =>
    props.hasViable &&
    `
    background-color: #e8f5e9;
    border-color: #4caf50;
  `}
`;
