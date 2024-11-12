import React from "react";

import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Plot from "react-plotly.js";

import {
  useOccurrenceByRace,
  useOccurrenceBySex,
} from "../../../hooks/dataLoaders/useOccurrence";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import HorizontalBarPlot from "../../../components/Charts/HorizontalBarPlot";
import useOverview from "../../../hooks/useOverview";

const OccurrenceByRaceChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useOverview(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => [
      {
        x: data.occurences.race.race,
        y: data.occurences.race.count,
      },
    ]
  );

  return (
    <DashboardCard title={"Ocorrências por Sexo"}>
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
            <HorizontalBarPlot data={data} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default OccurrenceByRaceChart;
