import {
  Autocomplete,
  Box,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import useTemporalSeries from "../../../hooks/dataLoaders/useTemporalSeries";
import { useFilter } from '../../../contexts/FilterContext';
import React, { useState } from "react";
import Plot from "react-plotly.js";
import Grid from "@mui/material/Grid2";

const generateAnnotations = (data) => {
  const serieTemporal = data.serieTemporal.map((item) => ({
    date: item.DT_NOTIFIC,
    count: item.count,
  }));

  const intervaloSemestral = data.intervaloSemestral;
  console.log(serieTemporal);

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
        font: { color: "black", size: 11, family: "Inter" },
      };
    }
    return null;
  });
  console.log(newAnnotations);
  return newAnnotations.filter((annotation) => annotation !== null);
};

const TemporalSeriesChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useTemporalSeries(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );

  const annotations = loading ? [] : generateAnnotations(data);

  return (
    <Grid
      container
      direction={"row"}
      sx={{ width: "100%", height: "100%" }}
      pt={5}
    >
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
          <Plot
            data={[
              {
                x: data.serieTemporal.map((item) => item["DT_NOTIFIC"]),
                y: data.serieTemporal.map((item) => item["count"]),
                type: "scatter",
                mode: "lines",
                // fill: "tozeroy",
                line: { width: 1.5, color: "rgba(0, 119, 182, 0.7)" },
                fillcolor: "#0077b6",
                hovertemplate:
                  "%{x|%d - %b - %Y}<br>Número de casos: %{y}<extra></extra>",
              },
            ]}
            style={{ width: "100%", height: "100%" }}
            layout={{
              xaxis: {
                showgrid: false,
                title: {
                  text: "Data de Notificação",
                  font: { color: "Black", size: 14, family: "Inter" },
                },
              },
              yaxis: {
                showgrid: true,
                gridcolor: "#e5e5e5",
                zerolinecolor: "#e5e5e5",
                gridwidth: 0.5,
              },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "white",
              legend: { font: { color: "black", size: 12, family: "Inter" } },
              font: { color: "black", size: 12, family: "Inter" },
              hoverlabel: {
                bgcolor: "white",
                font: { color: "black" },
                bordercolor: "#e5e5e5",
              },
              autosize: true,
              annotations: annotations,
            }}
            useResizeHandler={true}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TemporalSeriesChart;
