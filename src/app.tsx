import "./app.scss";
import { useState, useEffect } from "preact/hooks";
import Header from "./sections/Header";
import ViewNav, { type ViewKey } from "./components/ViewNav";
import HomeLayout from "./sections/HomeLayout";
import ExplorationLayout from "./sections/ExplorationLayout";
import OverviewLayout from "./sections/OverviewLayout";
import { useExploration } from "./data/exploration/hooks";

export const App = () => {
  const exploration = useExploration();
  const [currentView, setCurrentView] = useState<ViewKey>(
    exploration.active ? "exploration" : "home",
  );

  useEffect(() => {
    if (exploration.active) {
      setCurrentView("exploration");
    } else {
      setCurrentView("home");
    }
  }, [exploration.active]);

  const renderView = () => {
    switch (currentView) {
      case "exploration":
        return <ExplorationLayout />;
      case "overview":
        return <OverviewLayout />;
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
