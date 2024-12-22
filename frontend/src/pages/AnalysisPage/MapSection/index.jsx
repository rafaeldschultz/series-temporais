import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BigNumberCard from "../../../components/Cards/BigNumberCard";
import FilterPanel from "./FilterPanel";

import ChoroplethMap from "../../../components/Charts/MapPlot";
import selectMap from "../../../helpers/mapSelector";
import DashboardCard from "../../../components/Cards/DashboardCard";
import { useFilter } from "../../../contexts/FilterContext";

const MapSection = () => {
  const { filters } = useFilter();
  const data = selectMap(filters.federalState);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          mb: 4,
          padding: "20px",
        }}
      >
        <Stack gap={2} width={0.8}>
          <FilterPanel />

          {/* Ocorrência da SRAG */}
          <Grid container spacing={2}>
            <Grid size={8}>
              <DashboardCard title={"Ocorrências"}>
                <ChoroplethMap  mapType={'occurrences'} geojsonData={data} year={filters.year} state={filters.federalState}/>
              </DashboardCard>
            </Grid>
          </Grid>


        <Grid container spacing={2}>
          {/* MORAN */}
          <Grid size={6}>
            <DashboardCard title="MORAN">
              <ChoroplethMap mapType={'moran'} geojsonData={data} year={filters.year} state={filters.federalState}/>
            </DashboardCard>
          </Grid>


          {/* GETIS */}
          <Grid size={6}>
            <DashboardCard title="GETIS">
              <ChoroplethMap mapType={'getis'} geojsonData={data} year={filters.year} state={filters.federalState}/>
            </DashboardCard>
          </Grid>
        </Grid>




        </Stack>
      </Box>
    </>
  );
};

export default MapSection;
