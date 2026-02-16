import { render } from "preact";
import { App } from "./app.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingBarrier from "./LoadingBarrier.tsx";

const queryClient = new QueryClient();

render(
  <QueryClientProvider client={queryClient}>
    <LoadingBarrier>
      <App />
    </LoadingBarrier>
  </QueryClientProvider>,
  document.getElementById("app")!,
);
