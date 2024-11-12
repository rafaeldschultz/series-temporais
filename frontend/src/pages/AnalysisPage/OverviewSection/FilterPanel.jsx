import React, { useState } from "react";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useFilter } from "../../../contexts/FilterContext";
import Grid from "@mui/material/Grid2";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import DashboardCard from "../../../components/Cards/DashboardCard";
import SystemUpdateAltRoundedIcon from "@mui/icons-material/SystemUpdateAltRounded";

const FilterPanel = () => {
  const { filters, updateFilter } = useFilter();

  const [federalState, setFederalState] = useState();
  const [syndrome, setSyndrome] = useState();
  const [evolution, setEvolution] = useState();
  const [year, setYear] = useState();

  const handleSubmit = () => {
    updateFilter("federalState", federalState);
    updateFilter("syndrome", syndrome);
    updateFilter("evolution", evolution);
    updateFilter("year", year);
  };

  return (
    <DashboardCard>
      <Grid container justifyContent={"space-between"}>
        <Grid item size={5}>
          <Typography variant={"h5"} color="primary">
            Overview
          </Typography>
          <Typography variant={"body2"} color="textSecondary">
            Filtre os dados de acordo com sua necessidade
          </Typography>
        </Grid>
        <Grid item size={7}>
          <Grid
            container
            spacing={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Grid item size={"grow"}>
              <Autocomplete
                disablePortal
                options={[
                  "BA",
                  "PR",
                  "RS",
                  "RJ",
                  "CE",
                  "SP",
                  "DF",
                  "MG",
                  "SC",
                  "PB",
                  "MS",
                  "AM",
                  "SE",
                  "PA",
                  "MT",
                  "TO",
                  "GO",
                  "AL",
                  "PE",
                  "PI",
                  "ES",
                  "RR",
                  "AP",
                  "AC",
                  "RN",
                  "RO",
                  "MA",
                ].sort()}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Estado" size="small" />
                )}
                value={federalState}
                onChange={
                  (event, newValue) => setFederalState(newValue)
                  // updateFilter("federalState", newValue)
                }
              />
            </Grid>
            <Grid item size={"grow"}>
              <Autocomplete
                disablePortal
                options={[
                  "SRAG por influenza",
                  "SRAG por outro vírus respiratório",
                  "SRAG por outro agente etiológico",
                  "SRAG não especificado",
                  "SRAG por covid-19",
                ].sort()}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Sindrome" size="small" />
                )}
                onChange={
                  (event, newValue) => setSyndrome(newValue)
                  // updateFilter("syndrome", newValue)
                }
                value={syndrome}
              />
            </Grid>
            <Grid item size={"grow"}>
              <Autocomplete
                disablePortal
                options={[2024, 2023, 2022, 2021].sort()}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Ano" size="small" />
                )}
                onChange={(event, newValue) => setYear(newValue)} //updateFilter("year", newValue)}
                value={year}
              />
            </Grid>
            <Grid item size={"grow"}>
              <Autocomplete
                disablePortal
                options={[
                  "Cura",
                  "Óbito",
                  "Óbito por outras causas",
                  "Ignorado",
                ].sort()}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Evolução do Caso"
                    size="small"
                  />
                )}
                onChange={
                  (event, newValue) => setEvolution(newValue)
                  // updateFilter("evolution", newValue)
                }
                value={evolution}
              />
            </Grid>
            <Grid item>
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
