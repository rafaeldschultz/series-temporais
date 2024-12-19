import React, { useState } from "react";

import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import useTemporal, { useCorrelogram } from "../../../hooks/useTemporal";
import CorrelogramPlot from "../../../components/Charts/CorrelogramPlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import useDecomposition from "../../../hooks/useDecomposition";
import StaticChipHorizontalGrid from "../../../components/Chip/StaticChipHorizontalGrid";
import usePredict from "../../../hooks/usePredict";

const CorrelogramChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = usePredict(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => data.predictCorrelogram
  );

  const items = [
    {
      name: "numLags",
      label: "Número de Lags",
      currentValue: 40,
    },
    {
      name: "alpha",
      label: "Alpha",
      currentValue: 0.05,
    },
  ];

  return (
    <DashboardCard
      title={"Correlograma"}
      actions={<StaticChipHorizontalGrid items={items} />}
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
            <CorrelogramPlot data={data} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default CorrelogramChart;
