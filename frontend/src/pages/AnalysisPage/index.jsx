import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Page from "../../layouts/Page";
import SideMenu from "../../components/SideMenu/SideMenu";

import { useMemo, useState } from "react";
import { navigationItems } from "./navigation";

import { FilterProvider } from "../../contexts/FilterContext";

const AnalysisPage = () => {
  const [visibleChart, setVisibleChart] = useState(0);

  const navItems = useMemo(() => {
    return navigationItems.map((item, index) => ({
      ...item,
      id: index,
    }));
  });

  return (
    <Page sx={{ p: 0 }}>
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <SideMenu
          navigationItems={navItems}
          onSelect={setVisibleChart}
          selectedItemId={visibleChart}
        />
        <Box sx={{ width: "100%", height: "100%" }}>
          <FilterProvider>
            <Grid
              container
              direction={"row"}
              sx={{ width: "100%", height: "100%" }}
              pt={5}
            >
              <Grid size="grow">{navItems[visibleChart].component}</Grid>
            </Grid>
          </FilterProvider>
        </Box>
      </Box>
    </Page>
  );
};

export default AnalysisPage;
