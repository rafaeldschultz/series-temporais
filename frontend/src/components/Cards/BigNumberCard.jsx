import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardCard from "./DashboardCard";

const BigNumberCard = ({ title, number, percentage, isLoading, info }) => {
  return (
    <DashboardCard title={title} info={info}>
      <Stack spacing={2} mt={1} width={1}>
        <Grid container justifyContent={"space-between"}>
          <Grid>
            <Typography variant={"h1"}>
              {isLoading ? (
                <Skeleton width={250} />
              ) : typeof number === "number" ? (
                number.toLocaleString("pt-BR")
              ) : (
                number
              )}
            </Typography>
          </Grid>
          <Grid sx={{ display: "flex", alignItems: "center" }}>
            {isLoading ? (
              <Skeleton variant={"chip"} width={50} />
            ) : (
              percentage && (
                <Chip
                  label={percentage.toLocaleString("pt-BR", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                    style: "percent",
                  })}
                  color={"primary"}
                  sx={{ borderRadius: 2, fontWeight: "bold" }}
                />
              )
            )}
          </Grid>
        </Grid>
        {percentage && (
          <Box
            width={1}
            height={"0.5rem"}
            sx={{
              backgroundColor: "#eaeff4",
              borderRadius: 2,
              display: "block",
            }}
          >
            {isLoading || (
              <Box
                width={percentage}
                height={"0.5rem"}
                sx={(theme) => ({
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2,
                  display: "block",
                })}
              />
            )}
          </Box>
        )}
      </Stack>
    </DashboardCard>
  );
};

export default BigNumberCard;
