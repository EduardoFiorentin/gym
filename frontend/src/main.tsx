import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App";
import { Provider } from "./components/ui/provider";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
    {
    path: "/login",
    element: <Login/>,
  }

]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <Provider defaultTheme="light">
    <RouterProvider router={router} />,
  </Provider>
);
