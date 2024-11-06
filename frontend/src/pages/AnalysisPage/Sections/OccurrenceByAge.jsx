import React from "react";

import { Box, CircularProgress } from "@mui/material";

import Plot from "react-plotly.js";

import { useOccurrenceByAge } from "../../../hooks/dataLoaders/useOccurrence";
import { useFilter } from '../../../contexts/FilterContext';

const BarplotOccurrenceByAge = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useOccurrenceByAge(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );

  return loading ? (
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
    <>
      {console.log(data)}
      <Plot
        data={[
          {
            type: "bar",
            x: data.age,
            y: data.count,
            marker: {
              color: "royalblue",
              line: { color: "black", width: 1 },
            },
            textposition: "outside",
          },
        ]}
        layout={{
          title: {
            text: "Número de Ocorrências por Idade",
            x: 0.5,
            y: 0.9,
          },
          width: 900,
          height: 600,
          template: "plotly_white",
          xaxis: {
            title: "Idade",
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
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
      />
    </>
  );
};

export default BarplotOccurrenceByAge;
