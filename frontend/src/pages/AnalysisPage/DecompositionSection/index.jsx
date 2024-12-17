import { Box, Stack } from "@mui/material";

import FilterPanel from "./FilterPanel";
import { useFilter } from "../../../contexts/FilterContext";
import Grid from "@mui/material/Grid2";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";
import SerieStlDecompositionChart from "./SerieStlDecompositionChart";
import CountChart from "./CountChart";
import ResidualsChart from "./ResidualsChart";
import SeasonalChart from "./SeasonalChart";
import TrendChart from "./TrendChart";
import useDecomposition from "../../../hooks/useDecomposition";
import CorrelogramChart from "./CorrelogramChart";
import PartialCorrelogramChart from "./PartialCorrelogramChart";

const DecompositionSection = () => {
  const { filters } = useFilter();

  const { data, isPending: loading } = useDecomposition(
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
                {/* <Grid size={6}>
                  <SerieStlDecompositionChart />
                </Grid> */}
                <Grid size={6}>
                  <CountChart />
                </Grid>
                <Grid size={6}>
                  <TrendChart />
                </Grid>
                <Grid size={6}>
                  <SeasonalChart />
                </Grid>
                <Grid size={6}>
                  <ResidualsChart />
                </Grid>
                <Grid size={6}>
                  <CorrelogramChart />
                </Grid>
                <Grid size={6}>
                  <PartialCorrelogramChart />
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </FadeBox>
      )}
    </>
  );
};

export default DecompositionSection;
