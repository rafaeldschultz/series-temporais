import React from "react";

import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardCard from "../../../components/Cards/DashboardCard";
import CorrelogramPlot from "../../../components/Charts/CorrelogramPlot";
import StaticChipHorizontalGrid from "../../../components/Chip/StaticChipHorizontalGrid";
import { useFilter } from "../../../contexts/FilterContext";
import useSeasonalDecomposition from "../../../hooks/useSeasonalDecomposition";

import { List, ListItem, ListItemText, Typography } from "@mui/material";

const info = (
  <>
    <Typography variant="body1" fontWeight={"bold"}>
      Destaca a autocorrelação dos resíduos com uma defasagem específica,
      eliminando os efeitos das defasagens intermediárias.
    </Typography>
    <Typography variant="body2" my={1}>
      Especialmente útil para identificar as defasagens diretamente associadas
      aos resíduos, destacando relações que não são mediadas por outras
      defasagens.
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

const PartialCorrelogramChart = ({ period, model }) => {
  const { filters } = useFilter();

  const { data, isPending: loading } = useSeasonalDecomposition(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    period,
    model,
    (data) => data.partialCorrelogram
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
      title={"Correlograma Parcial"}
      actions={<StaticChipHorizontalGrid items={items} />}
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

export default PartialCorrelogramChart;
