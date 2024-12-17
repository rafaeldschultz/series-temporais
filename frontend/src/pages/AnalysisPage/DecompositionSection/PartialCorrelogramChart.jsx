import React, { useState } from "react";

import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import useTemporal, { useCorrelogram } from "../../../hooks/useTemporal";
import CorrelogramPlot from "../../../components/Charts/CorrelogramPlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import useDecomposition from "../../../hooks/useDecomposition";

const PartialCorrelogramChart = () => {
  const { filters } = useFilter();
  const [granularity, setGranularity] = useState(3);
  const [order, setOrder] = useState(1);
  const [numLags, setNumLags] = useState(1);
  const [alpha, setAlpha] = useState(1);

  const { data, isPending: loading } = useDecomposition(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => data.partialCorrelogram
  );

  const items = [
    {
      name: "granularity",
      label: "Granularidade",
      values: [
        {
          value: 3,
          label: "3D",
        },
        {
          value: 5,
          label: "5D",
        },
        {
          value: 7,
          label: "7D",
        },
        {
          value: 14,
          label: "14D",
        },
        {
          value: 28,
          label: "28D",
        },
      ],
      currentValue: granularity,
      onChange: (value) => setGranularity(value),
    },
    {
      name: "order",
      label: "Ordem",
      values: [
        {
          value: 1,
          label: "Primeira",
        },
        {
          value: 2,
          label: "Segunda",
        },
      ],
      currentValue: order,
      onChange: (value) => setOrder(value),
    },
    {
      name: "numLags",
      label: "Número de Lags",
      values: [
        {
          value: 1,
          label: "Primeira",
        },
        {
          value: 2,
          label: "Segunda",
        },
      ],
      currentValue: numLags,
      onChange: (value) => setNumLags(value),
    },
    {
      name: "alpha",
      label: "Alpha",
      values: [
        {
          value: 1,
          label: "Primeira",
        },
        {
          value: 2,
          label: "Segunda",
        },
      ],
      currentValue: alpha,
      onChange: (value) => setAlpha(value),
    },
  ];

  return (
    <DashboardCard
      title={"Correlograma Parcial"}
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
            <CorrelogramPlot data={data} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default PartialCorrelogramChart;
