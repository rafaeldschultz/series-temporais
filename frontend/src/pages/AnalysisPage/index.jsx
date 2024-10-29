import { Box, Breadcrumbs, Drawer, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Page from "../../layouts/Page";
import SideMenu from "../../components/SideMenu/SideMenu";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import LinePlot from "../../components/Charts/LinePlot";
import Grid from "@mui/material/Grid2";
import TemporalSeriesChart from "./Sections/temporalSeriesChart";

const AnalysisPage = () => {
  return (
    <Page sx={{ p: 0 }}>
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <SideMenu />
        <Box sx={{ p: 4, width: "100%", height: "100%" }}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
          >
            <Link underline="hover" color="inherit" href="/">
              Análise Estatística
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/material-ui/getting-started/installation/"
            >
              Temporal
            </Link>
            <Typography sx={{ color: "text.primary" }}>
              A Série Temporal
            </Typography>
          </Breadcrumbs>
          <Grid
            container
            direction={"row"}
            sx={{ width: "100%", height: "100%" }}
          >
            {/* <Grid size={5} spacing={2}></Grid> */}
            <Grid size="grow">
              {/* <LinePlot width="100%" height="100%" /> */}
              <TemporalSeriesChart />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

export default AnalysisPage;
