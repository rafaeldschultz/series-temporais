import {
  Box,
  Breadcrumbs,
  Drawer,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import Page from "../../layouts/Page";
import SideMenu from "../../components/SideMenu/SideMenu";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import LinePlot from "../../components/Charts/LinePlot";
import Grid from "@mui/material/Grid2";
import TemporalSeriesChart from "./Sections/temporalSeriesChart";
import { useState } from "react";
import { navigationItems } from "./Sections/navigation";

const AnalysisPage = () => {
  const [visibleChart, setVisibleChart] = useState(1);

  const lastHeader = navigationItems
    .slice(0, visibleChart) // Only consider items before the current selection
    .reverse() // Reverse to find the last "header" by searching from the end
    .find((item) => item.kind === "header");
  const currentTitle = navigationItems[visibleChart]?.title || "";
  const headerTitle = lastHeader ? lastHeader.title : "";

  return (
    <Page sx={{ p: 0 }}>
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <SideMenu
          navigationItems={navigationItems}
          onSelect={setVisibleChart}
          selectedItemId={visibleChart}
        />
        <Box sx={{ p: 4, width: "100%", height: "100%" }}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={
              <NavigateNextRoundedIcon fontSize="small" color="primary" />
            }
          >
            <Link color="primary" href="/analysis">
              Análise Estatística
            </Link>
            {headerTitle !== "" && (
              <Typography underline="hover" color="primary">
                {headerTitle}
              </Typography>
            )}
            {currentTitle !== "" && (
              <Typography underline="hover" color="primary">
                {currentTitle}
              </Typography>
            )}
          </Breadcrumbs>
          <Grid
            container
            direction={"row"}
            sx={{ width: "100%", height: "100%" }}
          >
            <Grid size="grow">{navigationItems[visibleChart].component}</Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

export default AnalysisPage;
