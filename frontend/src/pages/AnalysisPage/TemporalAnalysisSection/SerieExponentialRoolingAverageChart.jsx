import React from "react";
import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import useTemporal from "../../../hooks/useTemporal";
import LinePlot from "../../../components/Charts/LinePlot";

const SerieExponentialRoolingAverageChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useTemporal(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieExponentialRoolingAverage: [
        {
          x: data.serieExponentialRoolingAverage.map((item) => item.DT_NOTIFIC),
          y: data.serieExponentialRoolingAverage.map((item) => item.count),
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  console.log(data);

  return (
    <DashboardCard title={"Médias Móveis Exponenciais 3D"}>
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
            <LinePlot data={data.serieExponentialRoolingAverage} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieExponentialRoolingAverageChart;
