import { Typography } from "@mui/material";
import TemporalSeriesChart from "./temporalSeriesChart";
import OccurrenceBySexChart from "./occurrenceBySexChart";
import OccurrenceByRaceChart from "./OccurrenceByRaceChart";
import OverviewSection from "../OverviewSection";
import BarplotOccurrenceByDay from "./OccurrenceByDay";
import BarplotOccurrenceByAge from "./OccurrenceByAge";

export const navigationItems = [
  {
    id: 0,
    kind: "item",
    title: "Overview",
    component: <OverviewSection />,
  },
  {
    id: 1,
    kind: "header",
    title: "Temporal",
    isSelected: false,
  },
  {
    id: 2,
    kind: "item",
    title: "Série Temporal",
    component: <TemporalSeriesChart />,
  },
  {
    id: 3,
    kind: "item",
    title: "Ocorrência por Sexo",
    component: <OccurrenceBySexChart />,
  },
  {
    id: 4,
    kind: "item",
    title: "Ocorrência por Raça",
    component: <OccurrenceByRaceChart />,
  },
  {
    id: 5,
    kind: "item",
    title: "barplot_ocurrence_by_day",
    component: <BarplotOccurrenceByDay />,
  },
  {
    id: 6,
    kind: "item",
    title: "barplot_ocurrence_by_age",
    component: <OccurrenceByRaceChart />,
  },
  {
    id: 7,
    kind: "item",
    title: "lineplot_serie_differentiation",
    component: <OccurrenceByRaceChart />,
  },
  {
    id: 8,
    kind: "item",
    title: "lineplot_serie_exponential_rolling_average",
    component: <OccurrenceByRaceChart />,
  },
  {
    id: 9,
    kind: "item",
    title: "lineplot_serie_roling_average",
    component: <OccurrenceByRaceChart />,
  },
];
