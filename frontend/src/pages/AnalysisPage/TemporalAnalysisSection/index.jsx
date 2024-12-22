import { Box, Stack } from "@mui/material";

import Grid from "@mui/material/Grid2";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";
import { useFilter } from "../../../contexts/FilterContext";
import useTemporal from "../../../hooks/useTemporal";
import CorrelogramChart from "./CorrelogramChart";
import FilterPanel from "./FilterPanel";
import SerieDifferetiationChart from "./SerieDifferentiationChart";
import SerieExponentialRoolingAverageChart from "./SerieExponentialRoolingAverageChart";
import SerieRoolingAverageChart from "./SerieRoolingAverageChart";

const TemporalAnalysisSection = () => {
  const { filters, updateFilter } = useFilter();

  const {
    data,
    isPending: loading,
    error,
  } = useTemporal(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );

  if (error) {
    updateFilter("federalState", null);
    updateFilter("syndrome", null);
    updateFilter("year", null);
    updateFilter("evolution", null);
  }

  const transitionTimeout = 500;

  return (
    <>
      {loading || !data ? (
        <QuantumLoadingBox />
      ) : (
        <FadeBox in={!loading} timeout={transitionTimeout} sx={{ pb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Stack gap={2} width={0.8}>
              <FilterPanel />
              <Grid container spacing={2}>
                <Grid size={6}>
                  <SerieDifferetiationChart />
                </Grid>
                <Grid size={6}>
                  <SerieRoolingAverageChart />
                </Grid>
                <Grid size={6}>
                  <SerieExponentialRoolingAverageChart />
                </Grid>
                <Grid size={6}>
                  <CorrelogramChart />
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </FadeBox>
      )}
    </>
  );
};

export default TemporalAnalysisSection;
