import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import LinePlot from "../../../components/Charts/LinePlot";
import { useFilter } from "../../../contexts/FilterContext";
import usePredict from "../../../hooks/usePredict";

const info = (
  <>
    <Typography variant="body1" fontWeight={"bold"}>
      Série temporal original ao longo do tempo e as previsões do modelo,
      destacando a aderência entre os valores reais e ajustados.
    </Typography>
    <List sx={{ listStyle: "circle", pl: 4, pt: 0 }}>
      <ListItem sx={{ display: "list-item", p: 0 }}>
        <ListItemText>
          <Typography variant="body2">
            <b>Eixo x: </b> Data de Notificação
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

const TemporalSerieChart = () => {
  const theme = useTheme();
  const { filters } = useFilter();
  const { data, isPending: loading } = usePredict(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => ({
      serieStlDecomposition: [
        {
          x: data.originalSerie["DT_NOTIFIC"],
          y: data.originalSerie["Count"],
          name: "Ocorrências",
        },
        {
          x: data.originalSerie["DT_NOTIFIC"],
          y: data.originalSerie["Predict"],
          color: theme.palette.error.dark,
          name: "Predição",
        },
      ],
      axisLabels: { x: "Data de Notificação", y: "Número de Ocorrências" },
    })
  );

  return (
    <DashboardCard title={"Modelo ARIMA Ajustado"} info={info}>
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
export default TemporalSerieChart;
