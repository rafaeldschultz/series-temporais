import { Box, Stack } from "@mui/material";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";
import { useFilter } from "../../../contexts/FilterContext";
import usePredict from "../../../hooks/usePredict";
import FilterPanel from "./FilterPanel";
import Grid from "@mui/material/Grid2";
import TemporalSerieChart from "./TemporalSerieChart";
import ResidualsChart from "./ResidualsChart";
import BigNumberCard from "../../../components/Cards/BigNumberCard";

const PlotSection = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = usePredict(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );
  console.log(data);

  const transitionTimeout = 500;

  return (
    <>
      {loading ? (
        <QuantumLoadingBox verbose />
      ) : (
        <FadeBox in={!loading} timeout={transitionTimeout} sx={{ pb: 4 }}>
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
                <Grid size={3}>
                  <BigNumberCard
                    title={"AIC"}
                    isLoading={loading}
                    number={data?.aic?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  />
                </Grid>
                <Grid size={3}>
                  <BigNumberCard
                    title={"Ljung-Box"}
                    isLoading={loading}
                    number={data?.independenceTest["Ljung-Box"].toExponential(
                      2
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <TemporalSerieChart />
                </Grid>
                <Grid size={12}>
                  <ResidualsChart />
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </FadeBox>
      )}
    </>
  );
};

export default PlotSection;
