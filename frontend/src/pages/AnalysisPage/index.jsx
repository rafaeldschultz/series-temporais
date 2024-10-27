import { Breadcrumbs, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Page from "../../../layouts/Page";

const AnalysisPage = () => {
  return (
    <Page>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          MUI
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Core
        </Link>
        <Typography sx={{ color: "text.primary" }}>Breadcrumbs</Typography>
      </Breadcrumbs>
    </Page>
  );
};

export default AnalysisPage;
