import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import useTemporal from "../../../hooks/useTemporal";
import LinePlot from "../../../components/Charts/LinePlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import ScatterPlot from "../../../components/Charts/ScatterPlot";

const SerieLagChart = () => {
  const { filters } = useFilter();
  const [granularity, setGranularity] = useState("3D");
  const { data, isPending: loading } = useTemporal(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieLagPlot: [
        {
          x: data.serieLagPlot.yActual,
          y: data.serieLagPlot.yLagged,
        },
      ],
      serieLagLine: {
        x: [data.serieLagPlot.minVal, data.serieLagPlot.maxVal],
        y: [data.serieLagPlot.minVal, data.serieLagPlot.maxVal],
      },
    })
  );

  const items = [
    {
      name: "lag",
      label: "Lag",
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
      title={"Lags Temporais"}
      actions={<ChipHorizontalGrid items={items} />}
    >
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
            <ScatterPlot
              data={data.serieLagPlot}
              lineData={data.serieLagLine}
            />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieLagChart;
