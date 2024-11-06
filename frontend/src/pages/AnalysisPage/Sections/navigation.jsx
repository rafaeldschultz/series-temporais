import TemporalSeriesChart from "./TemporalSeriesChart";
import OccurrenceBySexChart from "./OccurrenceBySexChart";
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
  {
    id: 4,
    kind: "item",
    title: "barplot_ocurrence_by_day",
    component: <OccurrenceByRaceChart />,
  },
  {
    id: 5,
    kind: "item",
    title: "barplot_ocurrence_by_age",
    component: <OccurrenceByRaceChart />,
  },
  {
    id: 6,
    kind: "item",
    title: "lineplot_serie_differentiation",
    component: <OccurrenceByRaceChart />,
  },
  {
    id: 7,
    kind: "item",
    title: "lineplot_serie_exponential_rolling_average",
    component: <OccurrenceByRaceChart />,
  },
  {
    id: 8,
    kind: "item",
    title: "lineplot_serie_roling_average",
    component: <OccurrenceByRaceChart />,
  }
];
