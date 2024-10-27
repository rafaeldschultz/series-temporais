import { createBrowserRouter } from "react-router-dom";
import routes from "./routes";
import Root from "../../layouts/Root";

const router = () =>
  createBrowserRouter([
    {
      element: <Root />,
      children: routes(),
    },
  ]);

export default router;
