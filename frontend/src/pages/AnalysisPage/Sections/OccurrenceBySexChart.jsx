import React from "react";

import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Plot from "react-plotly.js";

import { useOccurrenceBySex } from "../../../hooks/dataLoaders/useOccurrence";
import { useFilter } from '../../../contexts/FilterContext';

const OccurrenceBySexChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useOccurrenceBySex(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );

  return (
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
  );
};

export default OccurrenceBySexChart;
