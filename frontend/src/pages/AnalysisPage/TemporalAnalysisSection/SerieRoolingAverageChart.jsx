import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import { useFilter } from "../../../contexts/FilterContext";
import useTemporal from "../../../hooks/useTemporal";

const info = (
  <>
    <Typography variant="body1" fontWeight={"bold"}>
      Suaviza a série temporal, eliminando variações de curto prazo e destacando
      tendências gerais.
    </Typography>
    <Typography variant="body2" my={1}>
      Facilita a análise de padrões e tendências de longo prazo.
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
            <b>Eixo y: </b> Resultado da média móvel aplicada à série.
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  </>
);

const SerieRoolingAverageChart = () => {
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
      serieRoolingAverage: [
        {
          x: data.serieRoolingAverage[granularity].map(
            (item) => item.DT_NOTIFIC
          ),
          y: data.serieRoolingAverage[granularity].map((item) => item.count),
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
      title={"Médias Móveis"}
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
            <LinePlot data={data.serieRoolingAverage} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieRoolingAverageChart;
