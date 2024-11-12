import React from "react";
import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import useTemporal from "../../../hooks/useTemporal";
import LinePlot from "../../../components/Charts/LinePlot";

const SerieRoolingAverageChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useTemporal(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieRoolingAverage: [
        {
          x: data.serieRoolingAverage.map((item) => item.DT_NOTIFIC),
          y: data.serieRoolingAverage.map((item) => item.count),
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  return (
    <DashboardCard title={"Médias Móveis 3D"}>
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
            <LinePlot data={data.serieRoolingAverage} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieRoolingAverageChart;
