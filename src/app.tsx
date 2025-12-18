import "./app.scss";
import Header from "./sections/Header";
import { GameLayout } from "./components/GameLayout";

export const App = () => {
  return (
    <>
      <Header />
      <GameLayout />
    </>
  );
};
