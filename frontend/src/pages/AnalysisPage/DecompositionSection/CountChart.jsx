import React, { useState } from "react";
import { Box, Chip, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import useDecomposition from "../../../hooks/useDecomposition";

const CountChart = ({ seasonal }) => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useDecomposition(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    seasonal,
    (data) => ({
      serieStlDecomposition: [
        {
          x: data.stlData["DT_NOTIFIC"],
          y: data.stlData["Count"],
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  return (
    <DashboardCard title={"Ocorrências"}>
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
            <LinePlot data={data.serieStlDecomposition} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default CountChart;
