import { useQueries } from "@tanstack/react-query";
import { storeQueries } from "./data/queries";

interface Props {
  children: React.ReactNode;
}
const LoadingBarrier = ({ children }: Props) => {
  const { allFetched: storesFetched } = useQueries({
    queries: storeQueries,
    combine: (results) => ({
      allFetched: results.every((r) => r.isFetched),
    }),
  });

  const isFetched = storesFetched;

  if (!isFetched) {
    return <> Loading... </>;
  }
  return <>{children}</>;
};

export default LoadingBarrier;
