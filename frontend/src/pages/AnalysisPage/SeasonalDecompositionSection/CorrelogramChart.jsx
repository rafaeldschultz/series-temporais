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
import useSeasonalDecomposition from "../../../hooks/useSeasonalDecomposition";

const CorrelogramChart = ({ period, model }) => {
  const { filters } = useFilter();

  const { data, isPending: loading } = useSeasonalDecomposition(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    period,
    model,
    (data) => data.correlogram
  );

  const items = [
    {
      name: "granularity",
      label: "Granularidade",
      currentValue: "3D",
    },
    {
      name: "order",
      label: "Ordem",
      currentValue: "3D",
    },
    {
      name: "numLags",
      label: "Número de Lags",
      currentValue: 25,
    },
    {
      name: "alpha",
      label: "Alpha",
      currentValue: 0.01,
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
