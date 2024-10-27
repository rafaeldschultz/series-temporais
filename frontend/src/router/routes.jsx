import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AnalysisPage from "../pages/AnalysisPage";

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
    path: "/analysis",
    title: "Análise Estatística",
    element: <AnalysisPage />,
  },
  {
    path: "/about",
    title: "Predições e Classificações",
    element: <HomePage />,
  },
];

export default routes;
