import AboutUsPage from "../pages/AboutUsPage";
import AnalysisPage from "../pages/AnalysisPage";
import HomePage from "../pages/HomePage";
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
  {
    path: "/aboutUs",
    title: "Sobre nós",
    element: <AboutUsPage />,
  },
];

export default routes;
