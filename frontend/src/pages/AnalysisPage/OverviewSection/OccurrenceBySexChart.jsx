import React from "react";

import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";

import DashboardCard from "../../../components/Cards/DashboardCard";
import HorizontalBarPlot from "../../../components/Charts/HorizontalBarPlot";
import { useFilter } from "../../../contexts/FilterContext";
import useOverview from "../../../hooks/useOverview";

const OccurrenceBySexChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useOverview(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => [
      {
        x: data.occurences.sex.sex,
        y: data.occurences.sex.count,
      },
    ]
  );

  return (
    <DashboardCard title={"Ocorrências por Sexo"}>
      <Grid container direction={"row"} sx={{ width: "100%", height: "100%" }}>
        <Grid size="grow">
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
            <HorizontalBarPlot data={data} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default OccurrenceBySexChart;
