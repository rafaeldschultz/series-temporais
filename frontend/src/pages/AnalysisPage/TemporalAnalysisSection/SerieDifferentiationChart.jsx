import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import { useFilter } from "../../../contexts/FilterContext";
import useTemporal from "../../../hooks/useTemporal";

import { List, ListItem, ListItemText, Typography } from "@mui/material";

const info = (
  <>
    <Typography variant="body1" fontWeight={"bold"}>
      Destaca as transformações aplicadas para tornar a série temporal
      estacionária.
    </Typography>
    <Typography variant="body2" my={1}>
      Especialmente útil para validar a preparação dos dados para modelos
      estatísticos.
    </Typography>
    <List sx={{ listStyle: "circle", pl: 4, pt: 0 }}>
      <ListItem sx={{ display: "list-item", p: 0 }}>
        <ListItemText>
          <Typography variant="body2">
            <b>Eixo x: </b> Data de notificação
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItem sx={{ display: "list-item", p: 0 }}>
        <ListItemText>
          <Typography variant="body2">
            <b>Eixo y: </b> Resultado da diferenciação aplicada à série.
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  </>
);

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
      info={info}
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
            <LinePlot data={data.serieDifferentiation} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieDifferetiationChart;
