import React from 'react';
import Plot from 'react-plotly.js';
import { CircularProgress, Box } from '@mui/material';
import { useFilter } from '../../../contexts/FilterContext';
import { useOccurrenceByRace } from "../../../hooks/dataLoaders/useOccurrence";

const OccurrenceByRaceChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useOccurrenceByRace(
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
    <Plot
      data={[
        {
          type: "bar",
          x: data.race,
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
          text: "Número de Ocorrências por Raça",
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
  );
};

export default OccurrenceByRaceChart;
