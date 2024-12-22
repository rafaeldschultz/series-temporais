import { useTheme } from "@emotion/react";
import { Box, CircularProgress } from "@mui/material";
import React from "react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import { useFilter } from "../../../contexts/FilterContext";
import useOverview from "../../../hooks/useOverview";

const generateAnnotations = (data) => {
  const theme = useTheme();
  const serieTemporal = data.temporalSeries.serieTemporal.map((item) => ({
    date: item.DT_NOTIFIC,
    count: item.count,
  }));

  const intervaloSemestral = data.temporalSeries.intervaloSemestral;

  const cumulativeCases = {};
  serieTemporal.reduce((acc, item) => {
    acc += item.count;
    if (intervaloSemestral.includes(item.date)) {
      cumulativeCases[item.date] = acc;
    }
    return acc;
  }, 0);

  const newAnnotations = intervaloSemestral.map((semestre) => {
    if (cumulativeCases[semestre]) {
      const yValue =
        serieTemporal.find((item) => item.date === semestre)?.count || 0;
      return {
        x: semestre,
        y: yValue,
        text: `${cumulativeCases[semestre].toLocaleString()}`,
        showarrow: false,
        ax: 0,
        ay: 30,
        font: {
          color: theme.palette.text.secondary,
          size: 11,
          family: "Inter",
        },
      };
    }
    return null;
  });
  return newAnnotations.filter((annotation) => annotation !== null);
};

const info = "teste info";

const TemporalSeriesChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useOverview(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieTemporal: [
        {
          x: data.temporalSeries.serieTemporal.map((item) => item.DT_NOTIFIC),
          y: data.temporalSeries.serieTemporal.map((item) => item.count),
        },
      ],
      intervaloSemestral: data.temporalSeries.intervaloSemestral,
      annotations: generateAnnotations(data),
      axisLabels: { x: "Data de Notificação", y: "Número de casos" },
    })
  );

  return (
    <DashboardCard title={"Série Temporal"} info={info}>
      {loading || !data ? (
        <Box
          width={1}
          height={1}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress />
        </Box>
      ) : (
        <LinePlot
          data={data.serieTemporal}
          annotations={data.annotations}
          axisLabels={data.axisLabels}
        />
      )}
    </DashboardCard>
  );
};

export default TemporalSeriesChart;
