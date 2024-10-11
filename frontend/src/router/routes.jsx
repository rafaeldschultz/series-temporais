import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";

const routes = () => [
  {
    path: "/",
    title: "Home",
    element: <HomePage />,
    removed: true,
  },
  {
    path: "/about",
    title: "Sobre os dados",
    element: <HomePage />,
  },
  {
    path: "/about",
    title: "Análise Estatística",
    element: <HomePage />,
  },
  {
    path: "/about",
    title: "Predições e Classificações",
    element: <HomePage />,
  },
];

export default routes;
