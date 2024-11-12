import { Card, CardContent, Stack, Typography } from "@mui/material";

const DashboardCard = ({ title, subtitle, children, sx, other }) => {
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
        <Stack>
          <Typography variant={"h5"} color="primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
