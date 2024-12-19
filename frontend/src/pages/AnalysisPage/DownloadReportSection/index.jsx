import { Box, Stack, Typography, Button } from "@mui/material";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";

const DownloadReportPage = () => {
  const handleDownload = () => {
    window.location.href = "http://0.0.0.0:8000/api/report";
  };

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
