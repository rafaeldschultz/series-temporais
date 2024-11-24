import OverviewSection from "./OverviewSection";
import RawDataSection from "./RawDataSection";
import TemporalAnalysisSection from "./TemporalAnalysisSection";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import UnderDevelopmentPage from "../UnderDevelopmentPage";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

export const navigationItems = [
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
    kind: "item",
    title: "Análise Temporal",
    component: <TemporalAnalysisSection />,
    icon: <HourglassTopRoundedIcon />,
  },
  {
    kind: "item",
    title: "Análise Espacial",
    component: <UnderDevelopmentPage />,
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
