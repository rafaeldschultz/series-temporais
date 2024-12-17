import { Box, Stack, Typography } from "@mui/material";

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
import { useCallback, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import BigNumberCard from "../../../components/Cards/BigNumberCard";

const DecompositionSection = () => {
  const { filters } = useFilter();
  const [initialSeasonzal, setInitialSeasonal] = useState(13);

  const { data, isPending: loading } = useDecomposition(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    initialSeasonzal
  );

  console.log(data);

  const debouncedSetInitialSeasonal = useCallback(
    useDebounce((value) => setInitialSeasonal(value), 300),
    []
  );

  const transitionTimeout = 500;

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
              <FilterPanel
                onChangeCustomFilter={debouncedSetInitialSeasonal}
                currentValueCustomFilter={initialSeasonzal}
              />

              <Grid container spacing={2}>
                <Grid size={6}>
                  <CountChart seasonal={initialSeasonzal} />
                </Grid>
                <Grid size={6}>
                  <TrendChart seasonal={initialSeasonzal} />
                </Grid>
                <Grid size={6}>
                  <SeasonalChart seasonal={initialSeasonzal} />
                </Grid>
                <Grid size={6}>
                  <ResidualsChart seasonal={initialSeasonzal} />
                </Grid>
                <Grid size={12}>
                  <Typography
                    variant={"h5"}
                    color="primary"
                    mt={2}
                    ml={1}
                    mb={1}
                  >
                    Teste de Estacionariedade
                  </Typography>
                </Grid>
                <Grid size={3}>
                  <BigNumberCard
                    title={"Estatística"}
                    isLoading={loading}
                    number={data?.stationarityTest?.testStatistic}
                  />
                </Grid>
                <Grid size={3}>
                  <BigNumberCard
                    title={"Valor p"}
                    isLoading={loading}
                    number={data?.stationarityTest?.pValue
                      .toExponential(2)
                      .replace(".", ",")}
                  />
                </Grid>
                <Grid size={6}>
                  <BigNumberCard
                    title={"Resultado"}
                    isLoading={loading}
                    number={
                      data?.stationarityTest?.stationary
                        ? "Estacionário"
                        : "Não Estacionário"
                    }
                  />
                </Grid>
                <Grid size={12}>
                  <Typography
                    variant={"h5"}
                    color="primary"
                    mt={2}
                    ml={1}
                    mb={1}
                  >
                    Correlogramas
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <CorrelogramChart seasonal={initialSeasonzal} />
                </Grid>
                <Grid size={6}>
                  <PartialCorrelogramChart seasonal={initialSeasonzal} />
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
