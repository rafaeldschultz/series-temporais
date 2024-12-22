import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BigNumberCard from "../../../components/Cards/BigNumberCard";
import FilterPanel from "./FilterPanel";

import ChoroplethMap from "../../../components/Charts/MapPlot";
import selectMap from "../../../helpers/mapSelector";
import { useFilter } from "../../../contexts/FilterContext";

const MapSection = () => {
  const { filters } = useFilter(); // Obtém o estado do filtro
  const data = selectMap(filters.federalState); // Seleciona o GeoJSON com base no filtro

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          mb: 4,
          padding: "20px",
        }}
      >
        <Stack gap={2} width={0.8}>
          {/* O FilterPanel precisa ser exibido aqui */}
          <FilterPanel />
          <Grid container spacing={2}>
            <Grid size={9}>
              {/* Passando os dados selecionados diretamente para o ChoroplethMap */}
              <ChoroplethMap geojsonData={data} year={filters.year} />
            </Grid>
            <Grid size={3}>
              <Grid
                container
                direction={"column"}
                spacing={2}
                justifyContent={"space-between"}
                height={1}
              >
                <Grid>
                  {/* Passando as informações corretas para o BigNumberCard */}
                  <BigNumberCard
                    title={"Óbitos"}
                    number={data.info.aggr}
                    percentage={data.info.aggr / data.info.pop}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
};

export default MapSection;
