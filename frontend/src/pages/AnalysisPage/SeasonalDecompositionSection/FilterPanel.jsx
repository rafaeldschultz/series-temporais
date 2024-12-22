import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import { useFilter } from "../../../contexts/FilterContext";

const FilterPanel = ({
  onChangePeriod,
  currentPeriod,
  onChangeModel,
  currentModel,
}) => {
  const { filters, updateFilter } = useFilter();

  const [federalState, setFederalState] = useState(filters.federalState);
  const [syndrome, setSyndrome] = useState(filters.syndrome);
  const [evolution, setEvolution] = useState(filters.evolution);
  const [year, setYear] = useState(filters.year);
  const [period, setPeriod] = useState(currentPeriod);
  const [model, setModel] = useState(currentModel);
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    updateFilter("federalState", federalState);
    updateFilter("syndrome", syndrome);
    updateFilter("evolution", evolution);
    updateFilter("year", year);
    onChangePeriod(period);
    onChangeModel(model);
  };

  return (
    <DashboardCard>
      <Grid container justifyContent={"space-between"} width={1}>
        <Grid size={4}>
          <Typography variant={"h5"} color="primary">
            Decomposição Sazonal
          </Typography>
          <Typography variant={"body2"} color="textSecondary">
            Filtre os dados de acordo com sua necessidade
          </Typography>
        </Grid>
        <Grid size={8}>
          <Grid
            container
            spacing={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Grid size={"grow"}>
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
            <Grid size={"grow"}>
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
            <Grid size={"grow"}>
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
            <Grid size={"grow"}>
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
            <Grid size={"grow"}>
              <TextField
                size="small"
                label="Período"
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                  htmlInput: {
                    min: 3,
                    step: 2,
                  },
                }}
                value={period}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (
                    newValue === "" ||
                    (parseInt(newValue) >= 3 && parseInt(newValue) % 2 !== 0)
                  ) {
                    setPeriod(newValue);
                    setError(false); // Reset error if input is valid
                  } else {
                    setError(true); // Show error if input is invalid
                  }
                }}
                error={error} // Enable error state based on validation
              />
            </Grid>
            <Grid size={"grow"}>
              <FormControl fullWidth size="small">
                <InputLabel>Modelo</InputLabel>
                <Select
                  value={model}
                  label="Modelo"
                  onChange={(event) => setModel(event.target.value)}
                >
                  <MenuItem value={"additive"}>Aditivo</MenuItem>
                  <MenuItem value={"multiplicative"}>Multiplicativo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <Tooltip title="Atualizar Gráficos">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  <RefreshRoundedIcon />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default FilterPanel;
