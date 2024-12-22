import FilterPanel from "./FilterPanel";
import { useFilter } from "../../../contexts/FilterContext";

import {
  Box,
  Stack,
  Typography,
  Button,
  Icon,
  IconButton,
  CircularProgress,
} from "@mui/material";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import api from "../../../helpers/axios";
import { downloadHtmlBase64File } from "../../../helpers/downloadFile";
import { useState } from "react";

const DownloadReportPage = () => {
  const { filters } = useFilter();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const params = {
      params: {
        uf: filters.federalState,
        syndrome: filters.syndrome,
        year: filters.year,
        evolution: filters.evolution,
      },
    };
    const response = await api
      .get("report", params)
      .then((res) => downloadHtmlBase64File("report.html", res["data"]))
      .catch((err) => {
        console.error(err);
        return null;
      });
    console.log(response);
    setLoading(false);
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
        <Stack spacing={2}>
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
