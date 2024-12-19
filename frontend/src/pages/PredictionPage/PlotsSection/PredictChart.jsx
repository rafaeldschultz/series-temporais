import React, { useState } from "react";
import { alpha, Box, Chip, CircularProgress, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import GeneralLinePlot from "../../../components/Charts/GeneralLinePlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import useDecomposition from "../../../hooks/useDecomposition";
import usePredict from "../../../hooks/usePredict";

const PredictChart = () => {
  const theme = useTheme();
  const { filters } = useFilter();

  const { data, isPending: loading } = usePredict(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieStlDecomposition: [
        {
          x: data.originalSerie["DT_NOTIFIC"],
          y: data.originalSerie["Count"],
          name: "Histórico",
          mode: "lines",
          type: "scatter",
          line: {
            width: 1.5,
            color: theme.palette.primary.main,
          },
          hovertemplate:
            "%{x|%d - %b - %Y}<br>Número de casos: %{y}<extra></extra>",
        },
        {
          x: data.predictMean["DT_NOTIFIC"],
          y: data.predictMean["predicted_mean"],
          color: theme.palette.error.dark,
          name: "Predição",
          type: "scatter",
          mode: "lines",
          line: {
            width: 2,
            color: theme.palette.error.main,
          },
        },
        {
          x: data.predictConf["DT_NOTIFIC"],
          y: data.predictConf["lower y"],
          color: theme.palette.error.light,
          name: "IC Inferior",
          type: "scatter",
          mode: "lines",
          line: {
            width: 1.5,
            color: theme.palette.warning.dark,
          },
        },
        {
          x: data.predictConf["DT_NOTIFIC"],
          y: data.predictConf["upper y"],
          color: theme.palette.error.dark,
          name: "IC Superior",
          type: "scatter",
          mode: "lines",
          line: {
            width: 1.5,
            color: theme.palette.warning.dark,
          },
          fill: "tonexty",
          fillcolor: alpha(theme.palette.warning.light, 0.3),
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  return (
    <DashboardCard title={"Predição"}>
      <Grid container direction={"row"} sx={{ width: "100%", height: "100%" }}>
        <Grid size="grow">
          {loading ? (
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
            <GeneralLinePlot plotData={data.serieStlDecomposition} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default PredictChart;
