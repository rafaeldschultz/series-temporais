import React, { useState } from "react";
import { Box, Chip, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFilter } from "../../../contexts/FilterContext";
import DashboardCard from "../../../components/Cards/DashboardCard";
import useTemporal from "../../../hooks/useTemporal";
import LinePlot from "../../../components/Charts/LinePlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";

const SerieDifferetiationChart = () => {
  const { filters } = useFilter();
  const [order, setOrder] = useState("first");
  const { data, isPending: loading } = useTemporal(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieDifferentiation: [
        {
          x: data.serieDifferentiation[order].map((item) => item.DT_NOTIFIC),
          y: data.serieDifferentiation[order].map((item) => item.count),
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  const items = [
    {
      name: "order",
      label: "Ordem",
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
      title={"Diferenciação"}
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
            <LinePlot data={data.serieDifferentiation} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieDifferetiationChart;
