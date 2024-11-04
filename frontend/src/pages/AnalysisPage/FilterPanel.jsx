import React from 'react';
import { Stack, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useFilter } from '../../contexts/FilterContext';

const FilterPanel = () => {
  const { filters, updateFilter } = useFilter();

  return (
    <Stack direction="column" spacing={3} height={1}>
      <Autocomplete
        disablePortal
        options={["BA", "PR", "RS", "RJ", "CE", "SP", "DF", "MG", "SC", "PB", "MS", "AM", "SE", "PA", "MT", "TO", "GO", "AL", "PE", "PI", "ES", "RR", "AP", "AC", "RN", "RO", "MA"].sort()}
        sx={{ width: 250 }}
        renderInput={(params) => <TextField {...params} label="Estado" />}
        value={filters.federalState}
        onChange={(event, newValue) => updateFilter("federalState", newValue)}
        
      />
      <Autocomplete
        disablePortal
        options={["SRAG por influenza", "SRAG por outro vírus respiratório", "SRAG por outro agente etiológico", "SRAG não especificado", "SRAG por covid-19"].sort()}
        sx={{ width: 250 }}
        renderInput={(params) => <TextField {...params} label="Sindrome" />}
        onChange={(event, newValue) => updateFilter("syndrome", newValue)}
        value={filters.syndrome}
      />
      <Autocomplete
        disablePortal
        options={[2024, 2023, 2022, 2021].sort()}
        sx={{ width: 250 }}
        renderInput={(params) => <TextField {...params} label="Ano" />}
        onChange={(event, newValue) => updateFilter("year", newValue)}
        value={filters.year}
      />
      <Autocomplete
        disablePortal
        options={["Cura", "Óbito", "Óbito por outras causas", "Ignorado"].sort()}
        sx={{ width: 250 }}
        renderInput={(params) => <TextField {...params} label="Evolução do Caso" />}
        onChange={(event, newValue) => updateFilter("evolution", newValue)}
        value={filters.evolution}
      />
    </Stack>
  );
};

export default FilterPanel;
