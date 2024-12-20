import FilterPanel from "./FilterPanel";
import { useFilter } from "../../../contexts/FilterContext";

import { Box, Stack, Typography, Button } from "@mui/material";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";

const DownloadReportPage = () => {

  const handleDownload = () => {
    const baseUrl = "http://0.0.0.0:8000/api/report";

    const params = {
        uf: filters.federalState,
        syndrome: filters.syndrome,
        year: filters.year,
        evolution: filters.evolution,
    };

    const url = new URL(baseUrl);
    Object.keys(params).forEach((key) => {
        if (params[key] != null) {
            url.searchParams.append(key, params[key]);
        }
    });

    window.location.href = url.toString();
  };

  const { filters } = useFilter();

  console.log(filters.federalState);

  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      height={1}
      width={1}
      spacing={4}
    >
      <GetAppRoundedIcon sx={{ fontSize: "8rem" }} color="primary" />
      <Typography
        sx={{ fontSize: "2.5rem", textAlign: "center" }}
        color="primary"
      >
        Download do Relatório Automatizado
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center" }}>
        Tem certeza que deseja realizar o download do relatório? Isso pode levar algum tempo.
      </Typography>
      <FilterPanel />
      <Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<GetAppRoundedIcon />}
          onClick={handleDownload}
        >
          Baixar Relatório
        </Button>
      </Box>
    </Stack>
  );
};

export default DownloadReportPage;
