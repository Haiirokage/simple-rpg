import styled from "styled-components";

type ViewKey = "home" | "exploration";

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
`;

interface ViewNavProps {
  currentView: ViewKey;
  onViewChange: (view: ViewKey) => void;
}

const ViewNav = ({ currentView, onViewChange }: ViewNavProps) => {
  return (
    <NavContainer>
      <TabButton active={currentView === "home"} onClick={() => onViewChange("home")}>
        Home
      </TabButton>
      <TabButton active={currentView === "exploration"} onClick={() => onViewChange("exploration")}>
        Exploration
      </TabButton>
    </NavContainer>
  );
};

export default ViewNav;
