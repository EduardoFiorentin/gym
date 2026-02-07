import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Provider } from "./components/ui/provider";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Training from "./pages/Training";

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

ReactDOM.createRoot(root).render(
  <Provider defaultTheme="light">
    <RouterProvider router={router} />,
  </Provider>
);
