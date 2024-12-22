import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import { useFilter } from "../../../contexts/FilterContext";
import useSeasonalDecomposition from "../../../hooks/useSeasonalDecomposition";

import { List, ListItem, ListItemText, Typography } from "@mui/material";

const info = (
  <>
    <Typography variant="body1" fontWeight={"bold"}>
      Captua padrões sazonais recorrentes nos dados, como aumentos ou quedas em
      determinados meses do ano.
    </Typography>
    <Typography variant="body2" my={1}>
      A presença de picos sazonais em meses específicos pode sugerir uma relação
      com fatores climáticos (ex.: aumento de casos em estações mais frias) ou
      comportamentos populacionais.
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
            <b>Eixo y: </b> Número de casos notificados.
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  </>
);

const SeasonalChart = ({ period, model }) => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useSeasonalDecomposition(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    period,
    model,
    (data) => ({
      serieStlDecomposition: [
        {
          x: data.seasonalData["DT_NOTIFIC"],
          y: data.seasonalData["Seasonal_values"],
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  return (
    <DashboardCard title={"Sazonalidade"} info={info}>
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
            <LinePlot data={data.serieStlDecomposition} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SeasonalChart;
