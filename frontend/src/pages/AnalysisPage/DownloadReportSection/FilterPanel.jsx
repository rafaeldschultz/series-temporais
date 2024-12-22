import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useFilter } from "../../../contexts/FilterContext";

const FilterPanel = () => {
  const { filters, updateFilter } = useFilter();

  const [federalState, setFederalState] = useState(filters.federalState);
  const [syndrome, setSyndrome] = useState(filters.syndrome);
  const [evolution, setEvolution] = useState(filters.evolution);
  const [year, setYear] = useState(filters.year);

  const handleSubmit = () => {
    updateFilter("federalState", federalState);
    updateFilter("syndrome", syndrome);
    updateFilter("evolution", evolution);
    updateFilter("year", year);
  };

  useEffect(() => {
    handleSubmit();
  }, [federalState, syndrome, evolution, year]);

  return (
    <Grid
      container
      spacing={4}
      alignItems={"center"}
      justifyContent={"center"}
      width={0.75}
    >
      <Grid size={6}>
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
      <Grid size={6}>
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
      <Grid size={6}>
        <Autocomplete
          disablePortal
          options={[2024, 2023, 2022, 2021].sort()}
          getOptionLabel={(option) => option.toString()}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Ano" size="small" />
          )}
          onChange={(event, newValue) => setYear(newValue)} //updateFilter("year", newValue)}
          value={year}
        />
      </Grid>
      <Grid size={6}>
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
            <TextField {...params} label="Evolução do Caso" size="small" />
          )}
          onChange={
            (event, newValue) => setEvolution(newValue)
            // updateFilter("evolution", newValue)
          }
          value={evolution}
        />
      </Grid>
    </Grid>
  );
};

export default FilterPanel;
