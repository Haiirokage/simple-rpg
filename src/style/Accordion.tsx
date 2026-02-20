import { useState } from "preact/hooks";
import styled from "styled-components";

export const Accordion = styled.div`
  width: 180px;
  height: 350px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TopicWrapper = styled.div`
  & + & {
    border-top: 1px solid #ccc;
  }
`;

const TopicHeader = styled.button`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border: none;
  font-family: inherit;
  font-size: 0.9em;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const TopicContent = styled.div`
  padding: 6px 10px 10px;
  font-size: 0.85em;
  border-top: 1px solid #eee;
`;

export const AccordionTopic = ({
  label,
  children,
}: {
  label: string;
  children: preact.ComponentChildren;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <TopicWrapper>
      <TopicHeader onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <span>{open ? "−" : "+"}</span>
      </TopicHeader>
      {open && <TopicContent>{children}</TopicContent>}
    </TopicWrapper>
  );
};
