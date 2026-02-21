import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from "./view/pages/Login";
import Home from "./view/pages/Home";
import Training from "./view/pages/Training";
import { Provider } from "./view/components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TIME_CONSTANTS_MILLIS } from "./utils/constants/time/constants";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
    {
    path: "/training",
    element: <Training/>,
  }

]);

const root = document.getElementById("root")!;

const queryClient = new QueryClient({
  // Optional: Define default options for queries
  defaultOptions: {
    queries: {
      staleTime: TIME_CONSTANTS_MILLIS.ONE_DAY, // Data is considered "stale" after 24 hours
    },
  },
});


ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
  <Provider defaultTheme="light">
    <RouterProvider router={router} />,
  </Provider>
  </QueryClientProvider>
);
