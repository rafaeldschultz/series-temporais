import {
  Card,
  CardContent,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import CustomWidthTooltip from "../Tooltip/CustomWidthTooltip";
import { Fragment } from "react";
import CustomTooltip from "../Tooltip/CustomTooltip";

const DashboardCard = ({
  title,
  subtitle,
  actions,
  info,
  children,
  sx,
  ...others
}) => {
  const theme = useTheme();

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
          <Grid
            container
            justifyContent={"space-between"}
            width={1}
            alignItems={"center"}
          >
            <Grid>
              {title && (
                <Typography variant="h5" color="primary">
                  {title}
                </Typography>
              )}
            </Grid>
            <Grid>
              {info && (
                <CustomWidthTooltip
                  title={
                    <Fragment>
                      <CustomTooltip title={info} />
                    </Fragment>
                  }
                  arrow
                  placement="bottom-end"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <HelpOutlineRoundedIcon color="primary" />
                </CustomWidthTooltip>
              )}
            </Grid>
          </Grid>
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
