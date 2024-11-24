import { Box, Stack } from "@mui/material";

import FilterPanel from "./FilterPanel";
import useOverview from "../../../hooks/useOverview";
import { useFilter } from "../../../contexts/FilterContext";
import useTemporal from "../../../hooks/useTemporal";
import CorrelogramChart from "./CorrelogramChart";
import Grid from "@mui/material/Grid2";
import SerieDifferetiationChart from "./SerieDifferentiationChart";
import SerieExponentialRoolingAverageChart from "./SerieExponentialRoolingAverageChart";
import SerieRoolingAverageChart from "./SerieRoolingAverageChart";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";

const TemporalAnalysisSection = () => {
  const { filters } = useFilter();

  const { data, isPending: loading } = useTemporal(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );

  const transitionTimeout = 500;

  return (
    <>
      {loading ? (
        <QuantumLoadingBox />
      ) : (
        <FadeBox in={!loading} timeout={transitionTimeout}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mb: 4,
            }}
          >
            <Stack gap={2} width={0.8}>
              <FilterPanel />
              <Grid container spacing={2}>
                <Grid item size={6}>
                  <SerieDifferetiationChart />
                </Grid>
                <Grid item size={6}>
                  <SerieRoolingAverageChart />
                </Grid>
                <Grid item size={6}>
                  <SerieExponentialRoolingAverageChart />
                </Grid>
                <Grid item size={6}>
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
