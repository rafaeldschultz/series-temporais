import { FilterProvider, useFilter } from "../../contexts/FilterContext";
import usePredict from "../../hooks/usePredict";
import Page from "../../layouts/Page";
import Grid from "@mui/material/Grid2";
import PlotSection from "./PlotsSection";

const PredictionPage = () => {
  return (
    <FilterProvider>
      <Page sx={{ p: 0, py: 4 }}>
        <PlotSection />
      </Page>
    </FilterProvider>
  );
};
export default PredictionPage;
