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
import CorrelogramChart from "./CorrelogramChart";
import PartialCorrelogramChart from "./PartialCorrelogramChart";

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
                <Grid size={4}>
                  <BigNumberCard
                    title={"AIC"}
                    isLoading={loading}
                    number={data?.aic?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  />
                </Grid>
                <Grid size={4}>
                  <BigNumberCard
                    title={"Ordem Predita"}
                    isLoading={loading}
                    number={data?.order.join("; ")}
                  />
                </Grid>
                <Grid size={4}>
                  <BigNumberCard
                    title={"Ordem Sazonal Predita"}
                    isLoading={loading}
                    number={data?.seasonalOrder.join("; ")}
                  />
                </Grid>
                <Grid size={12}>
                  <TemporalSerieChart />
                </Grid>
                <Grid size={8}>
                  <ResidualsChart />
                </Grid>
                <Grid size={4}>
                  <Grid container direction={"column"} spacing={2}>
                    <Grid size={12}>
                      <BigNumberCard
                        title={"Independência - Resíduos"}
                        isLoading={loading}
                        number={
                          data?.independenceTest.independenceResid
                            ? "Sim"
                            : "Não"
                        }
                      />
                    </Grid>
                    <Grid size={12}>
                      <BigNumberCard
                        title={"Normalidade - Resíduos"}
                        isLoading={loading}
                        number={data?.normTest.normResid ? "Sim" : "Não"}
                      />
                    </Grid>
                  </Grid>
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

export default PlotSection;
