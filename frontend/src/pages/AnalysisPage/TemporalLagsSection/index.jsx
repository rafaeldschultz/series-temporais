import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCallback, useMemo, useState } from "react";
import QuantumLoadingBox from "../../../components/Loading/QuantumLoadingBox";
import FadeBox from "../../../components/Transition/FadeBox";
import { useFilter } from "../../../contexts/FilterContext";
import useDebounce from "../../../hooks/useDebounce";
import useTemporalLags from "../../../hooks/useTemporalLags";
import FilterPanel from "./FilterPanel";
import SerieLagChart from "./SerieLagChart";

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

  const debouncedSetInitialLag = useCallback(
    useDebounce((value) => setInitialLag(value), 300),
    []
  );

  const mappedData = useMemo(() => {
    if (!loading && data)
      return Object.values(data).map((item, index) => (
        <Grid size={6} key={index}>
          <SerieLagChart
            data={item}
            index={initialLag * (index + 1)}
            loading={loading}
          />
        </Grid>
      ));
    return <></>;
  }, [data, initialLag, loading]);

  return (
    <>
      {!data ? (
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
                onChangeCustomFilter={debouncedSetInitialLag}
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
