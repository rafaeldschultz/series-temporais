import { Card, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const DashboardCard = ({
  title,
  subtitle,
  actions,
  children,
  sx,
  ...others
}) => {
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
      {...others}
    >
      <CardContent sx={{ px: 3, py: 3, width: "100%", height: "100%" }}>
        <Stack
          spacing={1.5}
          justifyContent={"center"}
          alignItems={"flex-start"}
        >
          {title && (
            <Typography variant="h5" color="primary">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="subtitle2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
          {actions && <Grid>{actions}</Grid>}
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
