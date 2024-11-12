import { Box, Chip, Stack, Typography } from "@mui/material";
import DashboardCard from "./DashboardCard";
import Grid from "@mui/material/Grid2";

const BigNumberCard = ({ title, number, percentage }) => {
  return (
    <DashboardCard title={title}>
      <Stack spacing={2} mt={2}>
        <Grid container justifyContent={"space-between"}>
          <Grid item>
            <Typography variant={"h1"}>
              {number.toLocaleString("pt-BR")}
            </Typography>
          </Grid>
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              label={percentage.toLocaleString("pt-BR", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
                style: "percent",
              })}
              color={"primary"}
              sx={{ borderRadius: 2, fontWeight: "bold" }}
            />
          </Grid>
        </Grid>
        <Box
          width={1}
          height={"0.5rem"}
          sx={{ backgroundColor: "#eaeff4", borderRadius: 2, display: "block" }}
        >
          <Box
            width={percentage}
            height={"0.5rem"}
            sx={(theme) => ({
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              display: "block",
            })}
          />
        </Box>
      </Stack>
    </DashboardCard>
  );
};

export default BigNumberCard;
