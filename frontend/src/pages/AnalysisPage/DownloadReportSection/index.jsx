import { useFilter } from "../../../contexts/FilterContext";
import FilterPanel from "./FilterPanel";

import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { downloadHtmlBase64File } from "../../../helpers/downloadFile";
import useReport from "../../../hooks/useReport";

const DownloadReportPage = () => {
  const { filters } = useFilter();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    refetch,
  } = useReport(
    filters.federalState,
    filters.syndrome,
    filters.year,
    filters.evolution
  );

  const handleDownload = async () => {
    const queryKey = [
      "report",
      filters.federalState,
      filters.syndrome,
      filters.year,
      filters.evolution,
    ];
    try {
      const cachedData = queryClient.getQueryData(queryKey);
      if (cachedData) {
        downloadHtmlBase64File("report.html", cachedData);
        toast.success("Relatório gerado com sucesso");
        return;
      }
      const { data: fetchedData } = await refetch();
      downloadHtmlBase64File("report.html", fetchedData);
      toast.success("Relatório gerado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar relatório");
    }
  };

  return (
    <Box height={1} px={4}>
      <Box
        sx={(theme) => ({
          boxShadow: theme.palette.card.shadow,
          borderRadius: 2,
          padding: 3,
          backgroundColor: theme.palette.background.paper,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.124), rgba(255, 255, 255, 0.124))",
          border: 0,
          height: "100%",
        })}
      >
        <Stack>
          <Typography variant={"h5"} color="primary">
            Exportar Relatório
          </Typography>
          <Typography variant={"body2"} color="textSecondary">
            Selecione os filtros para exportar o relatório
          </Typography>
        </Stack>

        <Box
          height={0.9}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack
            spacing={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 0.8,
              width: "100%",
              pb: 6,
            }}
          >
            <Box
              sx={(theme) => ({
                border: "2px solid",
                borderRadius: "50%",
                borderColor: theme.palette.primary.dark,
                padding: 2,
              })}
            >
              <GetAppRoundedIcon
                sx={(theme) => ({
                  fontSize: "8rem",
                  color: theme.palette.primary.dark,
                })}
              />
            </Box>

            <FilterPanel />

            <Typography
              variant={"body1"}
              color="textSecondary"
              fontWeight={"bold"}
            >
              A geração de relatórios pode demorar um pouco.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<GetAppRoundedIcon />}
              onClick={handleDownload}
              sx={(theme) => ({ backgroundColor: theme.palette.primary.dark })}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Typography mr={2}>Gerando relatório...</Typography>
                  <CircularProgress size={24} color="inherit" />
                </>
              ) : (
                "Exportar Relatório"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
  // return (
  //   <Stack
  //     justifyContent={"center"}
  //     alignItems={"center"}
  //     height={1}
  //     width={1}
  //     spacing={4}
  //   >
  //     <GetAppRoundedIcon sx={{ fontSize: "8rem" }} color="primary" />
  //     <Typography
  //       sx={{ fontSize: "2.5rem", textAlign: "center" }}
  //       color="primary"
  //     >
  //       Download do Relatório Automatizado
  //     </Typography>
  //     <Typography
  //       variant="h6"
  //       color="text.secondary"
  //       sx={{ textAlign: "center" }}
  //     >
  //       Tem certeza que deseja realizar o download do relatório? Isso pode levar
  //       algum tempo.
  //     </Typography>
  //     <FilterPanel />
  //     <Box>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         size="large"
  //         startIcon={<GetAppRoundedIcon />}
  //         onClick={handleDownload}
  //       >
  //         Baixar Relatório
  //       </Button>
  //     </Box>
  //   </Stack>
  // );
};

export default DownloadReportPage;
