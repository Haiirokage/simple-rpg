import "./app.scss";
import { useState } from "preact/hooks";
import Header from "./sections/Header";
import ViewNav from "./components/ViewNav";
import HomeLayout from "./sections/HomeLayout";
import ExplorationLayout from "./sections/ExplorationLayout";

type ViewKey = "home" | "exploration";

export const App = () => {
  const [currentView, setCurrentView] = useState<ViewKey>("home");

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
