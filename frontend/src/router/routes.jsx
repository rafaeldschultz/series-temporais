import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AnalysisPage from "../pages/AnalysisPage";
import UnderDevelopmentPage from "../pages/UnderDevelopmentPage";
import PredictionPage from "../pages/PredictionPage";

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
    path: "/predictions",
    title: "Predições",
    element: <PredictionPage />,
  },
];

export default routes;
