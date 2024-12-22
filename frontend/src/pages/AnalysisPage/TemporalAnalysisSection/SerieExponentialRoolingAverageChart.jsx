import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import { useFilter } from "../../../contexts/FilterContext";
import useTemporal from "../../../hooks/useTemporal";

const SerieExponentialRoolingAverageChart = () => {
  const { filters } = useFilter();
  const [granularity, setGranularity] = useState("3D");
  const {
    data,
    isPending: loading,
    error,
  } = useTemporal(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieExponentialRoolingAverage: [
        {
          x: data.serieExponentialRoolingAverage[granularity].map(
            (item) => item.DT_NOTIFIC
          ),
          y: data.serieExponentialRoolingAverage[granularity].map(
            (item) => item.count
          ),
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  const items = [
    {
      name: "granularity",
      label: "Granularidade",
      values: [
        {
          value: "3D",
          label: "3D",
        },
        {
          value: "5D",
          label: "5D",
        },
        {
          value: "7D",
          label: "7D",
        },
        {
          value: "14D",
          label: "14D",
        },
        {
          value: "28D",
          label: "28D",
        },
      ],
      currentValue: granularity,
      onChange: (value) => setGranularity(value),
    },
  ];

  return (
    <DashboardCard
      title={"Médias Móveis Exponenciais"}
      actions={<ChipHorizontalGrid items={items} />}
    >
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
            <LinePlot data={data.serieExponentialRoolingAverage} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieExponentialRoolingAverageChart;
