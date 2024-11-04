import React from 'react';
import Grid from "@mui/material/Grid2";
import { FilterProvider } from '../../../contexts/FilterContext';
import FilterPanel from '../FilterPanel';
import OccurrenceByRaceChart from '../OccurenceByRaceChart';

const OccurrenceByRacePage = () => (
  <FilterProvider>
    <Grid container direction={"row"} sx={{ width: "100%", height: "100%" }} pt={5}>
      <Grid item xs={3}>
        <FilterPanel />
      </Grid>
      <Grid item xs={9} container alignItems="center" justifyContent="center">
        <OccurrenceByRaceChart />
      </Grid>
    </Grid>
  </FilterProvider>
);

export default OccurrenceByRacePage;
