import { Card, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const DashboardCard = ({ title, subtitle, actions, children, sx, other }) => {
  return (
    <Card
      elevation={9}
      sx={(theme) => ({
        boxShadow: theme.palette.card.shadow,
        borderRadius: 2,
        width: "100%",
        height: "100%",
        ...sx,
      })}
      {...other}
    >
      <CardContent sx={{ px: 3, py: 3, width: "100%", height: "100%" }}>
        <Stack
          spacing={1.5}
          justifyContent={"center"}
          alignItems={"flex-start"}
        >
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            rowSpacing={2}
            columnSpacing={6}
            width={1}
          >
            <Grid>
              <Typography variant={"h5"} color="primary">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle2" color="textSecondary">
                  {subtitle}
                </Typography>
              )}
            </Grid>
          </Grid>
          {actions && <Grid>{actions}</Grid>}
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
