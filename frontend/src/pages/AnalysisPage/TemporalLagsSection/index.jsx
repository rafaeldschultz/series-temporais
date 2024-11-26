import { Box, Stack } from "@mui/material";
import FilterPanel from "./FilterPanel";
import { useFilter } from "../../../contexts/FilterContext";
import useTemporal from "../../../hooks/useTemporal";
import Grid from "@mui/material/Grid2";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";
import SerieLagChart from "./SerieLagChart";
import { useMemo, useState } from "react";
import useTemporalLags from "../../../hooks/useTemporalLags";

const TemporalLagsSection = () => {
  const { filters } = useFilter();
  const [initialLag, setInitialLag] = useState(3);

  const { data, isPending: loading } = useTemporalLags(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution,
    initialLag
  );

  const transitionTimeout = 500;
  const mappedData = useMemo(() => {
    if (!loading)
      return Object.values(data).map((item, index) => {
        return (
          <Grid size={6} key={index}>
            <SerieLagChart
              data={item}
              index={initialLag * (index + 1)}
              loading={loading}
            />
          </Grid>
        );
      });
    return <></>;
  }, [data, initialLag, loading]);

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
                onChangeCustomFilter={setInitialLag}
                currentValueCustomFilter={initialLag}
              />
              <Grid container spacing={2}>
                {mappedData}
              </Grid>
            </Stack>
          </Box>
        </FadeBox>
      )}
    </>
  );
};

export default TemporalLagsSection;
