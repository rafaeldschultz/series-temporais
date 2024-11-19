import { Box, CircularProgress, Fade, Grow, Stack } from "@mui/material";
import OccurrenceByRaceChart from "./OccurrenceByRaceChart";
import OccurrenceBySexChart from "./OccurrenceBySexChart";
import TemporalSeriesChart from "./TemporalSeriesChart";
import Grid from "@mui/material/Grid2";
import BigNumberCard from "../../../components/Cards/BigNumberCard";
import FilterPanel from "./FilterPanel";
import useOverview from "../../../hooks/useOverview";
import { useFilter } from "../../../contexts/FilterContext";
import OccurrenceByAgeChart from "./OccurrenceByAgeChart";
import OccurrenceByDayChart from "./OccurrenceByDayChart";
import FadeBox from "../../../components/Transition/FadeBox";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";

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
                <Grid item size={9}>
                  <TemporalSeriesChart />
                </Grid>
                <Grid item size={3}>
                  <Grid
                    container
                    direction={"column"}
                    spacing={2}
                    justifyContent={"space-between"}
                    height={1}
                  >
                    <Grid item>
                      <BigNumberCard
                        title={"Óbitos"}
                        isLoading={loading}
                        number={data?.general.totalDeaths}
                        percentage={
                          data
                            ? data.general.totalDeaths / data.general.totalCases
                            : 0
                        }
                      />
                    </Grid>
                    <Grid item>
                      <Grid item>
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
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
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
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item size={4}>
                  <OccurrenceBySexChart />
                </Grid>
                <Grid item size={4}>
                  <OccurrenceByRaceChart />
                </Grid>
                <Grid item size={4}>
                  <OccurrenceByDayChart />
                </Grid>
                <Grid item size={12}>
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
