import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Page from "../../layouts/Page";
import SideMenu from "../../components/SideMenu/SideMenu";
import FilterPanel from './FilterPanel';

import { useState } from "react";
import { navigationItems } from "./Sections/navigation";

import { FilterProvider } from '../../contexts/FilterContext';


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

          <FilterProvider>
            <Grid container direction={"row"} sx={{ width: "100%", height: "100%" }} pt={5}>
              <Grid item xs={3}>
                <FilterPanel />
              </Grid>
              <Grid item xs={9} container alignItems="center" justifyContent="center">
                {navigationItems[visibleChart].component}
              </Grid>
            </Grid>
          </FilterProvider>

        </Box>
      </Box>
    </Page>
  );
};

export default AnalysisPage;
