import { Typography } from "@mui/material";
import TemporalSeriesChart from "./temporalSeriesChart";
import OccurrenceBySexChart from "./occurrenceBySexChart";
import OccurrenceByRaceChart from "./OccurrenceByRaceChart";

export const navigationItems = [
  {
    id: 0,
    kind: "header",
    title: "Temporal",
    isSelected: false,
  },
  {
    id: 1,
    kind: "item",
    title: "Série Temporal",
    component: <TemporalSeriesChart />,
  },
  {
    id: 2,
    kind: "item",
    title: "Ocorrência por Sexo",
    component: <OccurrenceBySexChart />,
  },
  {
    id: 3,
    kind: "item",
    title: "Ocorrência por Raça",
    component: <OccurrenceByRaceChart />,
  },
];
