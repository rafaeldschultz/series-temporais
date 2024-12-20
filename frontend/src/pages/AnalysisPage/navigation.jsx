// import OverviewSection from "./OverviewSection";
// import RawDataSection from "./RawDataSection";
import TemporalAnalysisSection from "./TemporalAnalysisSection";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
// import UnderDevelopmentPage from "../UnderDevelopmentPage";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import GrainRoundedIcon from "@mui/icons-material/GrainRounded";
// import DecompositionSection from "./DecompositionSection";
// import TemporalLagsSection from "./TemporalLagsSection";
import AnimationRoundedIcon from "@mui/icons-material/AnimationRounded";
import SummarizeIcon from '@mui/icons-material/Summarize';
import { lazy } from "react";
import SeasonalDecompositionSection from "./SeasonalDecompositionSection";
import ScatterPlotRoundedIcon from "@mui/icons-material/ScatterPlotRounded";

import ChoroplethMap from "../../components/Charts/MapPlot";

const OverviewSection = lazy(() => import("./OverviewSection"));
const RawDataSection = lazy(() => import("./RawDataSection"));
const DecompositionSection = lazy(() => import("./DecompositionSection"));
const TemporalLagsSection = lazy(() => import("./TemporalLagsSection"));
const UnderDevelopmentPage = lazy(() => import("../UnderDevelopmentPage"));
const DownloadReportPage = lazy(() => import("./DownloadReportSection"));


export const navigationItems = [
  {
    kind: "item",
    title: "Relatório Automático",
    component: <DownloadReportPage />,
    icon: <SummarizeIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Análise Espacial",
  },
  {
    kind: "item",
    title: "Dados Brutos",
    component: <RawDataSection />,
    icon: <TableChartRoundedIcon />,
  },
  {
    kind: "item",
    title: "Overview",
    component: <OverviewSection />,
    icon: <DashboardRoundedIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Análise Temporal",
  },
  {
    kind: "item",
    title: "Geral",
    component: <TemporalAnalysisSection />,
    icon: <HourglassTopRoundedIcon />,
  },
  {
    kind: "item",
    title: "Decomposição STL",
    component: <DecompositionSection />,
    icon: <GrainRoundedIcon />,
  },
  {
    kind: "item",
    title: "Decomposição Sazonal",
    component: <SeasonalDecompositionSection />,
    icon: <ScatterPlotRoundedIcon />,
  },
  {
    kind: "item",
    title: "Lags Temporais",
    component: <TemporalLagsSection />,
    icon: <AnimationRoundedIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Análise Espacial",
  },
  {
    kind: "item",
    title: "Geral",
    component: <ChoroplethMap />,
    icon: <MapRoundedIcon />,
  },
  // {
  //   kind: "header",
  //   title: "Temporal",
  // },
  // {
  //   kind: "item",
  //   title: "Série Temporal",
  //   component: <TemporalSeriesChart />,
  // },
  // {
  //   kind: "item",
  //   title: "Ocorrência por Sexo",
  //   component: <OccurrenceBySexChart />,
  // },
  // {
  //   kind: "item",
  //   title: "Ocorrência por Raça",
  //   component: <OccurrenceByRaceChart />,
  // },
  // {
  //   kind: "item",
  //   title: "barplot_ocurrence_by_day",
  //   component: <BarplotOccurrenceByDay />,
  // },
  // {
  //   kind: "item",
  //   title: "barplot_ocurrence_by_age",
  //   component: <OccurrenceByRaceChart />,
  // },
  // {
  //   kind: "item",
  //   title: "lineplot_serie_differentiation",
  //   component: <OccurrenceByRaceChart />,
  // },
  // {
  //   kind: "item",
  //   title: "lineplot_serie_exponential_rolling_average",
  //   component: <OccurrenceByRaceChart />,
  // },
  // {
  //   kind: "item",
  //   title: "lineplot_serie_roling_average",
  //   component: <OccurrenceByRaceChart />,
  // },
];
