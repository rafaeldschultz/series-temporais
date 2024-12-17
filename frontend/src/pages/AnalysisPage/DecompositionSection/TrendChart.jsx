import React, { useState } from "react";
import { Box, Chip, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import useDecomposition from "../../../hooks/useDecomposition";

const TrendChart = () => {
  const { filters } = useFilter();
  const [order, setOrder] = useState("first");
  const { data, isPending: loading } = useDecomposition(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieStlDecomposition: [
        {
          x: data.stlData["DT_NOTIFIC"],
          y: data.stlData["Trend_values"],
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  const items = [
    {
      name: "seasonal",
      label: "Sazonalidade",
      values: [
        {
          value: "first",
          label: "Primeira",
        },
        {
          value: "second",
          label: "Segunda",
        },
      ],
      currentValue: order,
      onChange: (value) => setOrder(value),
    },
  ];

  return (
    <DashboardCard
      title={"Tendência"}
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
            <LinePlot data={data.serieStlDecomposition} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default TrendChart;
