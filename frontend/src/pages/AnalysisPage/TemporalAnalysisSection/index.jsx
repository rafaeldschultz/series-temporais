import { Box, Stack } from "@mui/material";

import FilterPanel from "./FilterPanel";
import useOverview from "../../../hooks/useOverview";
import { useFilter } from "../../../contexts/FilterContext";
import useTemporal from "../../../hooks/useTemporal";
import CorrelogramChart from "./CorrelogramChart";
import Grid from "@mui/material/Grid2";
import SerieDifferetiationChart from "./SerieDifferentiationChart";
import SerieExponentialRoolingAverageChart from "./serieExponentialRoolingAverageChart";
import SerieRoolingAverageChart from "./SerieRoolingAverageChart";

const TemporalAnalysisSection = () => {
  const { filters } = useFilter();

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", width: "100%", mb: 4 }}
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

        {/* <Grid container spacing={2}>
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
                        ? data.general.totalRecovered / data.general.totalCases
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
                    (data?.general.totalRecovered + data?.general.totalDeaths)
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
          </Grid> */}
        {/* </Grid> */}
      </Stack>
    </Box>
  );
};

export default TemporalAnalysisSection;
