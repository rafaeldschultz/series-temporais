import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import { useFilter } from "../../../contexts/FilterContext";
import useSeasonalDecomposition from "../../../hooks/useSeasonalDecomposition";

const ResidualsChart = ({ period, model }) => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useSeasonalDecomposition(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    period,
    model,
    (data) => ({
      serieStlDecomposition: [
        {
          x: data.seasonalData["DT_NOTIFIC"],
          y: data.seasonalData["Resid_values"],
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  return (
    <DashboardCard title={"Resíduo"}>
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
            <LinePlot data={data.serieStlDecomposition} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default ResidualsChart;
