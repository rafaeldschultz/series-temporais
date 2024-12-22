import React, { useState } from "react";

import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardCard from "../../../components/Cards/DashboardCard";
import CorrelogramPlot from "../../../components/Charts/CorrelogramPlot";
import ChipHorizontalGrid from "../../../components/Chip/ChipHorizontalGrid";
import { useFilter } from "../../../contexts/FilterContext";
import { useCorrelogram } from "../../../hooks/useTemporal";
import { getAlphaList, getNumLagsList } from "./helpers";

import { List, ListItem, ListItemText, Typography } from "@mui/material";

const info = (
  <>
    <Typography variant="body1" fontWeight={"bold"}>
      Destaca a autocorrelação entre uma observação e as observações anteriores
      para diferentes <i>lags</i>.
    </Typography>
    <Typography variant="body2" my={1}>
      Valores significativos de autocorrelação indicam padrões ou dependências
      temporais nos resíduos, o que sugere que o modelo ajustado pode não estar
      capturando todos os padrões subjacentes.
    </Typography>
    <List sx={{ listStyle: "circle", pl: 4, pt: 0 }}>
      <ListItem sx={{ display: "list-item", p: 0 }}>
        <ListItemText>
          <Typography variant="body2">
            <b>Eixo x: </b> Número de <i>lags</i>.
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItem sx={{ display: "list-item", p: 0 }}>
        <ListItemText>
          <Typography variant="body2">
            <b>Eixo y: </b> Coeficiente de autocorrelação.
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  </>
);

const CorrelogramChart = () => {
  const { filters } = useFilter();
  const [granularity, setGranularity] = useState(3);
  const [order, setOrder] = useState(1);
  const [numLags, setNumLags] = useState(3);
  const [alpha, setAlpha] = useState(0.1);

  const { data, isPending: loading } = useCorrelogram(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    granularity,
    order,
    numLags,
    alpha
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
      values: getNumLagsList(),
      currentValue: numLags,
      onChange: (value) => setNumLags(value),
    },
    {
      name: "alpha",
      label: "Alpha",
      values: getAlphaList(),
      currentValue: alpha,
      onChange: (value) => setAlpha(value),
    },
  ];

  return (
    <DashboardCard
      title={"Correlograma"}
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
            <CorrelogramPlot data={data} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default CorrelogramChart;
