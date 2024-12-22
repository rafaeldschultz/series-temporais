import React from "react";

import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";

import DashboardCard from "../../../components/Cards/DashboardCard";
import HorizontalBarPlot from "../../../components/Charts/HorizontalBarPlot";
import { useFilter } from "../../../contexts/FilterContext";
import useOverview from "../../../hooks/useOverview";

import { List, ListItem, ListItemText, Typography } from "@mui/material";

const info = (
  <>
    <Typography variant="body1" fontWeight={"bold"}>
      Ocorrências de síndrome gripal por idade.
    </Typography>
    <List sx={{ listStyle: "circle", pl: 4, pt: 0 }}>
      <ListItem sx={{ display: "list-item", p: 0 }}>
        <ListItemText>
          <Typography variant="body2">
            <b>Eixo x: </b> Idade
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

const OccurrenceByAgeChart = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useOverview(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    (data) => [
      {
        x: data.occurences.age.age,
        y: data.occurences.age.count,
      },
    ]
  );

  return (
    <DashboardCard title={"Ocorrências por Idade"} info={info}>
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
            <HorizontalBarPlot data={data} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default OccurrenceByAgeChart;
