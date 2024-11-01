import {
  Autocomplete,
  Box,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import useTemporalSeries from "../../../hooks/dataLoaders/useTemporalSeries";
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
  const [federalState, setFederalState] = useState(null);
  const [syndrome, setSyndrome] = useState(null);
  const [year, setYear] = useState(null);
  const [evolution, setEvolution] = useState(null);

  const { data, isPending: loading } = useTemporalSeries(
    federalState,
    syndrome,
    year,
    evolution
  );

  const annotations = loading ? [] : generateAnnotations(data);

  return (
    <Grid
      container
      direction={"row"}
      sx={{ width: "100%", height: "100%" }}
      pt={5}
    >
      <Grid>
        <Stack direction="column" spacing={3} height={1}>
          <Autocomplete
            disablePortal
            name="federalState"
            options={[
              "BA",
              "PR",
              "RS",
              "RJ",
              "CE",
              "SP",
              "DF",
              "MG",
              "SC",
              "PB",
              "MS",
              "AM",
              "SE",
              "PA",
              "MT",
              "TO",
              "GO",
              "AL",
              "PE",
              "PI",
              "ES",
              "RR",
              "AP",
              "AC",
              "RN",
              "RO",
              "MA",
            ].sort()}
            sx={{ width: 250 }}
            renderInput={(params) => <TextField {...params} label="Estado" />}
            value={federalState}
            onChange={(event, newValue) => setFederalState(newValue)}
          />
          <Autocomplete
            disablePortal
            name="syndrome"
            options={[
              "SRAG por influenza",
              "SRAG por outro vírus respiratório",
              "SRAG por outro agente etiológico",
              "SRAG não especificado",
              "SRAG por covid-19",
            ].sort()}
            sx={{ width: 250 }}
            renderInput={(params) => <TextField {...params} label="Sindrome" />}
            onChange={(event, newValue) => setSyndrome(newValue)}
            value={syndrome}
          />
          <Autocomplete
            disablePortal
            name="year"
            options={[2024, 2023, 2022, 2021].sort()}
            sx={{ width: 250 }}
            renderInput={(params) => <TextField {...params} label="Ano" />}
            onChange={(event, newValue) => setYear(newValue)}
            value={year}
          />
          <Autocomplete
            disablePortal
            name="diseaseType"
            options={[
              "Cura",
              "Óbito",
              "Óbito por outras causas",
              "Ignorado",
            ].sort()}
            sx={{ width: 250 }}
            renderInput={(params) => (
              <TextField {...params} label="Evolução do Caso" />
            )}
            onChange={(event, newValue) => setEvolution(newValue)}
            value={evolution}
          />
        </Stack>
      </Grid>
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
