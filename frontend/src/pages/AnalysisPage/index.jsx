import {
  Box,
} from "@mui/material";
import Page from "../../layouts/Page";
import SideMenu from "../../components/SideMenu/SideMenu";
import { useState } from "react";
import { navigationItems } from "./Sections/navigation";

const AnalysisPage = () => {
  const [visibleChart, setVisibleChart] = useState(1);

  return (
    <Page sx={{ p: 0 }}>
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <SideMenu
          navigationItems={navigationItems}
          onSelect={setVisibleChart}
          selectedItemId={visibleChart}
        />
        <Box sx={{ p: 4, width: "100%", height: "100%" }}>
          {navigationItems[visibleChart].component}
        </Box>
      </Box>
    </Page>
  );
};

export default AnalysisPage;
