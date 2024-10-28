import { Box, Breadcrumbs, Drawer, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Page from "../../layouts/Page";
import SideMenu from "../../components/SideMenu/SideMenu";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

const AnalysisPage = () => {
  return (
    <Page sx={{ p: 0 }}>
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <SideMenu />
        <Box sx={{ p: 4 }}>
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
              Espacial
            </Link>
            <Typography sx={{ color: "text.primary" }}>Breadcrumbs</Typography>
          </Breadcrumbs>
        </Box>
      </Box>
    </Page>
  );
};

export default AnalysisPage;
