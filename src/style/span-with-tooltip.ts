import styled from "styled-components";

export const SpanWithTooltip = styled.span<{ $tooltip?: string }>`
  position: relative;
  display: inline-block;
  cursor: ${(props) => (props.$tooltip ? "help" : "inherit")};

  &:hover::after {
    ${(props) =>
      props.$tooltip
        ? `content: "${props.$tooltip}";
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background-color: #f5f5f5;
    color: #333;
    padding: 10px 14px;
    border-radius: 4px;
    font-size: 12px;
    white-space: normal;
    width: 320px;
    z-index: 1000;
    line-height: 1.5;
    text-align: left;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: 1px solid #ddd;`
        : ""}
  }
`;
