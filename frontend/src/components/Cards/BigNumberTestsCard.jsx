import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material";
import DashboardCard from "./DashboardCard";
import Grid from "@mui/material/Grid2";

const BigNumberTestesCard = ({
  title,
  result,
  statisticNumber,
  statisticName,
  isLoading,
}) => {
  return (
    <DashboardCard title={title}>
      <Stack spacing={2.5} mt={1} width={1}>
        <Grid container justifyContent={"space-between"}>
          <Grid>
            <Typography variant={"h1"}>
              {isLoading ? <Skeleton width={250} /> : result}
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent={"space-between"}>
          <Grid>
            <Typography variant={"h4"} color="secondary">
              {isLoading ? (
                <Skeleton width={250} />
              ) : (
                statisticNumber.toExponential(2)
              )}
            </Typography>
          </Grid>
          <Grid sx={{ display: "flex", alignItems: "center" }}>
            {isLoading ? (
              <Skeleton variant={"chip"} width={50} />
            ) : (
              <Chip
                label={statisticName}
                color={"primary"}
                sx={{ borderRadius: 2, fontWeight: "bold" }}
              />
            )}
          </Grid>
          {/* <Grid sx={{ display: "flex", alignItems: "center" }}>
            {isLoading ? (
              <Skeleton variant={"chip"} width={50} />
            ) : (
              <Chip
                label={statisticNumber}
                color={"primary"}
                sx={{ borderRadius: 2, fontWeight: "bold" }}
              />
            )}
          </Grid> */}
        </Grid>
      </Stack>
    </DashboardCard>
  );
};

export default BigNumberTestesCard;
