import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BigNumberCard from "../../../components/Cards/BigNumberCard";
import BigNumberTestesCard from "../../../components/Cards/BigNumberTestsCard";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";
import { useFilter } from "../../../contexts/FilterContext";
import usePredict from "../../../hooks/usePredict";
import CorrelogramChart from "./CorrelogramChart";
import FilterPanel from "./FilterPanel";
import PartialCorrelogramChart from "./PartialCorrelogramChart";
import PredictChart from "./PredictChart";
import ResidualsChart from "./ResidualsChart";
import TemporalSerieChart from "./TemporalSerieChart";

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
            <Stack gap={2} width={0.75}>
              <FilterPanel />
              <Grid container spacing={2}>
                <Grid size={6}>
                  <BigNumberCard
                    title={"Ordem Predita"}
                    isLoading={loading}
                    number={data?.order.join("; ")}
                    info={"Ordem do modelo ARIMA ajustado."}
                  />
                </Grid>
                <Grid size={6}>
                  <BigNumberCard
                    title={"Ordem Sazonal Predita"}
                    isLoading={loading}
                    number={data?.seasonalOrder.join("; ")}
                    info={"Ordem sazonal do modelo ARIMA ajustado."}
                  />
                </Grid>
                <Grid size={12}>
                  <TemporalSerieChart />
                </Grid>
                <Grid size={12}>
                  <PredictChart />
                </Grid>
                <Grid size={8}>
                  <ResidualsChart />
                </Grid>
                <Grid size={4}>
                  <Grid container direction={"column"} spacing={2}>
                    <Grid size={12}>
                      <BigNumberCard
                        title={"AIC"}
                        isLoading={loading}
                        number={data?.aic?.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        info={"Critério de Informação de Akaike."}
                      />
                    </Grid>
                    <Grid size={12}>
                      <BigNumberTestesCard
                        title={"Independência - Resíduos"}
                        isLoading={loading}
                        result={
                          data?.independenceTest.independenceResid
                            ? "Sim"
                            : "Não"
                        }
                        statisticName={"Ljung-Box"}
                        statisticNumber={data?.independenceTest["Ljung-Box"]}
                        info={
                          "Verifica se os resíduos do modelo são livres de autocorrelação, ou seja, independentes. Essa é uma das principais suposições de modelos de séries temporais."
                        }
                      />
                    </Grid>
                    <Grid size={12}>
                      <BigNumberTestesCard
                        title={"Normalidade - Resíduos"}
                        isLoading={loading}
                        result={data?.normTest.normResid ? "Sim" : "Não"}
                        statisticName={"Jarque-Bera"}
                        statisticNumber={data?.normTest["Jarque-Bera"]}
                        info={
                          "Verifica se os resíduos do modelo são puramente aleatórios."
                        }
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
