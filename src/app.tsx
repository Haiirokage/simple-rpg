import "./app.scss";
import { useState } from "preact/hooks";
import Header from "./sections/Header";
import ViewNav from "./components/ViewNav";
import HomeLayout from "./sections/HomeLayout";
import ExplorationLayout from "./sections/ExplorationLayout";
import { useExploration } from "./data/exploration/hooks";

type ViewKey = "home" | "exploration";

export const App = () => {
  const exploration = useExploration();
  const [currentView, setCurrentView] = useState<ViewKey>(
    exploration.active ? "exploration" : "home",
  );

  const renderView = () => {
    switch (currentView) {
      case "exploration":
        return <ExplorationLayout />;
      case "home":
      default:
        return <HomeLayout />;
    }
  };

  return (
    <>
      <Header />
      <ViewNav currentView={currentView} onViewChange={setCurrentView} />
      {renderView()}
    </>
  );
};
