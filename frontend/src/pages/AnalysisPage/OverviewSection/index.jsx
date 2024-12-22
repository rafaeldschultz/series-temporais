import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BigNumberCard from "../../../components/Cards/BigNumberCard";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";
import { useFilter } from "../../../contexts/FilterContext";
import useOverview from "../../../hooks/useOverview";
import FilterPanel from "./FilterPanel";
import OccurrenceByAgeChart from "./OccurrenceByAgeChart";
import OccurrenceByDayChart from "./OccurrenceByDayChart";
import OccurrenceByRaceChart from "./OccurrenceByRaceChart";
import OccurrenceBySexChart from "./OccurrenceBySexChart";
import TemporalSeriesChart from "./TemporalSeriesChart";

const OverviewSection = () => {
  const { filters } = useFilter();
  const { data, isPending: loading } = useOverview(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );

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
              mb: 4,
            }}
          >
            <Stack gap={2} width={0.8}>
              <FilterPanel />
              <Grid container spacing={2}>
                <Grid size={8}>
                  <TemporalSeriesChart />
                </Grid>
                <Grid size={4}>
                  <Grid
                    container
                    direction={"column"}
                    spacing={2}
                    justifyContent={"space-between"}
                    height={1}
                  >
                    <Grid>
                      <BigNumberCard
                        title={"Óbitos"}
                        isLoading={loading}
                        number={data?.general.totalDeaths}
                        percentage={
                          data
                            ? data.general.totalDeaths / data.general.totalCases
                            : 0
                        }
                        info={"Número de óbitos confirmados."}
                      />
                    </Grid>
                    <Grid>
                      <BigNumberCard
                        title={"Recuperados"}
                        isLoading={loading}
                        number={data?.general.totalRecovered}
                        percentage={
                          data
                            ? data.general.totalRecovered /
                              data.general.totalCases
                            : 0
                        }
                        info={"Número de casos recuperados."}
                      />
                    </Grid>
                    <Grid>
                      <BigNumberCard
                        title={"Outras Notificações"}
                        isLoading={loading}
                        number={
                          data?.general.totalCases -
                          (data?.general.totalRecovered +
                            data?.general.totalDeaths)
                        }
                        percentage={
                          data
                            ? (data.general.totalCases -
                                (data.general.totalRecovered +
                                  data.general.totalDeaths)) /
                              data.general.totalCases
                            : 0
                        }
                        info={"Número de casos restantes."}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid size={4}>
                  <OccurrenceBySexChart />
                </Grid>
                <Grid size={4}>
                  <OccurrenceByRaceChart />
                </Grid>
                <Grid size={4}>
                  <OccurrenceByDayChart />
                </Grid>
                <Grid size={12}>
                  <OccurrenceByAgeChart />
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </FadeBox>
      )}
    </>
  );
};

export default OverviewSection;
