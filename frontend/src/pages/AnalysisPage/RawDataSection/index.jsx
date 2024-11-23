import useRawData from "../../../hooks/useRawData";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Page from "../../../layouts/Page";
import { useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import CustomToolbar from "../../../components/Datagrid/CustomToolbar";

const RawDataSection = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const { data, isPending } = useRawData(
    paginationModel.page,
    paginationModel.pageSize
  );

  const rowCountRef = useRef(data?.rowCount || 0);
  const rowCount = useMemo(() => {
    if (data?.rowCount !== undefined) {
      rowCountRef.current = data.rowCount;
    }

    return rowCountRef.current;
  }, [data?.rowCount]);

  return (
    <Box height={"100%"} px={4}>
      <DataGrid
        rows={data.rows}
        columns={data.columns}
        rowCount={rowCount}
        loading={isPending}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          panel: {
            anchorEl: filterButtonEl,
            placement: "bottom-end",
          },
          toolbar: {
            setFilterButtonEl,
            title: "Dados Brutos",
            subtitle: "Visualização dos Dados utilizados para Análise",
          },
        }}
        sx={(theme) => ({
          boxShadow: theme.palette.card.shadow,
          borderRadius: 2,
          padding: 3,
          backgroundColor: theme.palette.background.paper,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.124), rgba(255, 255, 255, 0.124))",
          border: 0,
        })}
        autosizeOptions={{
          includeOutliers: true,
          includeHeaders: true,
        }}
      />
    </Box>
  );
};

export default RawDataSection;
