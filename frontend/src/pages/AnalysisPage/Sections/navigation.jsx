import { Typography } from "@mui/material";
import TemporalSeriesChart from "./temporalSeriesChart";

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
    title: "Série Temporal Tipografia",
    component: <Typography> Teste </Typography>,
  },
];
