import styled from "styled-components";
import { useExploration } from "../data/exploration/hooks";

export type ViewKey = "home" | "exploration" | "overview";

const NavContainer = styled.nav`
  display: flex;
  background-color: #f5f5f5;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-bottom: ${(props) => (props.active ? "none" : "1px solid #ccc")};
  background-color: ${(props) => (props.active ? "#fff" : "#f0f0f0")};
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  font-size: 0.9em;

  &:hover {
    background-color: #e8e8e8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ViewNavProps {
  currentView: ViewKey;
  onViewChange: (view: ViewKey) => void;
}

const ViewNav = ({ currentView, onViewChange }: ViewNavProps) => {
  const exploration = useExploration();

  return (
    <NavContainer>
      <TabButton
        active={currentView === "home"}
        disabled={exploration.active}
        onClick={() => onViewChange("home")}
      >
        Home
      </TabButton>
      <TabButton
        active={currentView === "exploration"}
        disabled={!exploration.active}
        onClick={() => onViewChange("exploration")}
      >
        Exploration
      </TabButton>
      <TabButton active={currentView === "overview"} onClick={() => onViewChange("overview")}>
        Overview
      </TabButton>
    </NavContainer>
  );
};

export default ViewNav;
