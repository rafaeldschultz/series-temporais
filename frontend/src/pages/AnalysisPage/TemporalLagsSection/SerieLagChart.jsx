import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardCard from "../../../components/Cards/DashboardCard";
import ScatterPlot from "../../../components/Charts/ScatterPlot";

const SerieLagChart = ({ data, index, loading }) => {
  const serieLagPlot = [
    {
      x: data.yActual,
      y: data.yLagged,
    },
  ];
  const serieLagLine = {
    x: [data.minVal, data.maxVal],
    y: [data.minVal, data.maxVal],
  };

  return (
    <DashboardCard title={`Lags Temporais ${index}D`}>
      <Grid container direction={"row"} sx={{ width: "100%", height: "100%" }}>
        <Grid size="grow">
          {loading ? (
            <Box
              width={1}
              height={1}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <CircularProgress />
            </Box>
          ) : (
            <ScatterPlot data={serieLagPlot} lineData={serieLagLine} />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};
export default SerieLagChart;
