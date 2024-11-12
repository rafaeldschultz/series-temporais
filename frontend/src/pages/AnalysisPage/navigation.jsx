import { Typography } from "@mui/material";
import TemporalSeriesChart from "./sections/temporalSeriesChart";
import OccurrenceBySexChart from "./sections/occurrenceBySexChart";
import OccurrenceByRaceChart from "./sections/OccurrenceByRaceChart";
import OverviewSection from "./OverviewSection";
import BarplotOccurrenceByDay from "./sections/OccurrenceByDay";

export const navigationItems = [
  {
    kind: "item",
    title: "Overview",
    component: <OverviewSection />,
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
