import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardCard from "../../../components/Cards/DashboardCard";
import ScatterPlot from "../../../components/Charts/ScatterPlot";

import { List, ListItem, ListItemText, Typography } from "@mui/material";

const info = (lags) => (
  <>
    <Typography variant="body1" fontWeight={"bold"}>
      Mostra relações entre valores da série temporal com defasagens de até{" "}
      {lags} períodos.
    </Typography>
    <List sx={{ listStyle: "circle", pl: 4, pt: 0 }}>
      <ListItem sx={{ display: "list-item", p: 0 }}>
        <ListItemText>
          <Typography variant="body2">
            <b>Eixo x: </b> Número de casos notificados.
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

const SerieLagChart = ({ data, index, loading }) => {
  const serieLagPlot = [
    {
      x: data.yActual,
      y: data.yLagged,
    },
  ];
  const serieLagLine = {
    x: [data.minVal, data.maxVal],
    y: [data.minVal, data.maxVal],
  };

  return (
    <DashboardCard title={`Lags Temporais ${index}D`} info={info(index)}>
      <Grid container direction={"row"} sx={{ width: "100%", height: "100%" }}>
        <Grid size="grow">
          {!data ? (
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
            <ScatterPlot data={serieLagPlot} lineData={serieLagLine} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieLagChart;
