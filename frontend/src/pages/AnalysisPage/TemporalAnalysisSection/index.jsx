import { Box, Stack } from "@mui/material";

import FilterPanel from "./FilterPanel";
import { useFilter } from "../../../contexts/FilterContext";
import useTemporal from "../../../hooks/useTemporal";
import CorrelogramChart from "./CorrelogramChart";
import Grid from "@mui/material/Grid2";
import SerieDifferetiationChart from "./SerieDifferentiationChart";
import SerieExponentialRoolingAverageChart from "./SerieExponentialRoolingAverageChart";
import SerieRoolingAverageChart from "./SerieRoolingAverageChart";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";
import SerieLagChart from "./SerieLagChart";

const TemporalAnalysisSection = () => {
  const { filters } = useFilter();

  const { data, isPending: loading } = useTemporal(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );

  const transitionTimeout = 500;
  console.log(data);

  return (
    <>
      {loading ? (
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
                  <SerieLagChart />
                </Grid>
                <Grid size={12}>
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
