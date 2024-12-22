import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import DashboardCard from "../../../components/Cards/DashboardCard";
import { useFilter } from "../../../contexts/FilterContext";
import SystemUpdateAltRoundedIcon from "@mui/icons-material/SystemUpdateAltRounded";

const FilterPanel = () => {
  const { filters, updateFilter } = useFilter();
  
  const [federalState, setFederalState] = useState(filters.federalState);
  const [year, setYear] = useState(filters.year);

  const handleSubmit = () => {
    updateFilter("federalState", federalState);
    updateFilter("year", year);
  };

  return (
    <DashboardCard>
      <Grid container justifyContent={"space-between"} width={1}>
        <Grid size={5}>
          <Typography variant={"h5"} color="primary">
            Ocorrências no Brasil
          </Typography>
          <Typography variant={"body2"} color="textSecondary">
            Filtre e selecione os dados
          </Typography>
        </Grid>
        <Grid size={7}>
          <Grid
            container
            spacing={2}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ width: "100%" }}
          >
            <Grid size={"grow"}>
              <Autocomplete
                disablePortal
                options={[
                  "BA", "PR", "RS", "RJ", "CE", "SP", "DF", "MG", "SC", "PB", "MS", "AM", "SE", "PA", "MT", "TO", "GO", "AL", "PE", "PI", "ES", "RR", "AP", "AC", "RN", "RO", "MA",
                ].sort()}
                sx={{ minWidth: "150px", width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Estado" size="small" />
                )}
                value={federalState}
                onChange={
                  (event, newValue) => setFederalState(newValue)
                }
              />
            </Grid>

            <Grid size={"grow"}>
              <Autocomplete
                disablePortal
                options={[2024, 2023, 2022, 2021].sort()}
                sx={{ minWidth: "150px", width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Ano" size="small" />
                )}
                onChange={(event, newValue) => setYear(newValue)}
                value={year}
              />
            </Grid>

            <Grid>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
              >
                <SystemUpdateAltRoundedIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default FilterPanel;
