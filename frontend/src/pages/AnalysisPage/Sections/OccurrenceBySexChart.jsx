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
import { useOccurrenceBySex } from "../../../hooks/dataLoaders/useOccurrence";

const OccurrenceBySexChart = () => {
  const [federalState, setFederalState] = useState(null);
  const [syndrome, setSyndrome] = useState(null);
  const [year, setYear] = useState(null);
  const [evolution, setEvolution] = useState(null);

  const { data, isPending: loading } = useOccurrenceBySex(
    federalState,
    syndrome,
    year,
    evolution
  );

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
                type: "bar",
                x: data.sex,
                y: data.count,
                marker: {
                  color: "royalblue",
                  line: { color: "black", width: 1 },
                },
                text: data.count,
                textposition: "outside",
              },
            ]}
            style={{ width: "100%", height: "100%" }}
            layout={{
              title: {
                text: "Número de Ocorrências por Sexo",
                x: 0.5,
                y: 0.9,
              },
              xaxis: {
                title: "Sexo",
                showline: true,
                linewidth: 1,
                linecolor: "black",
              },
              yaxis: {
                title: "Número de Ocorrências",
                showline: true,
                linewidth: 1,
                linecolor: "black",
              },
              autosize: true,
              template: "plotly_white",
            }}
            useResizeHandler={true}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default OccurrenceBySexChart;
