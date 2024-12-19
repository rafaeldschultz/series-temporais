import Grid from "@mui/material/Grid2";

import Page from "../../layouts/Page";
import SideMenu from "../../components/SideMenu/SideMenu";
import { navigationItems } from "./navigation";
import { FilterProvider } from "../../contexts/FilterContext";
import { Suspense, useState } from "react";

const AnalysisPage = () => {
  const [visibleChart, setVisibleChart] = useState(3);

  const navItems = navigationItems.map((item, index) => ({
    ...item,
    id: index,
  }));

  return (
    <Page sx={{ p: 0, py: 4 }}>
      <Grid container height={"100%"} width={"100%"}>
        <Grid>
          <SideMenu
            navigationItems={navItems}
            onSelect={setVisibleChart}
            selectedItemId={visibleChart}
          />
        </Grid>
        <Grid size="grow" height={"100%"}>
          <Suspense>
            <FilterProvider>{navItems[visibleChart].component}</FilterProvider>
          </Suspense>
        </Grid>
      </Grid>
    </Page>
  );
};

export default AnalysisPage;
