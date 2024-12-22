import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useMemo, useRef, useState } from "react";
import CustomToolbar from "../../../components/Datagrid/CustomToolbar";
import useDebounce from "../../../hooks/useDebounce";
import useRawData from "../../../hooks/useRawData";

const RawDataSection = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [queryOptions, setQueryOptions] = useState({});
  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const debouncedSetQueryOptions = useDebounce((newFilterOptions) => {
    setQueryOptions(newFilterOptions);
  }, 500);

  const onFilterChange = useCallback(
    (filterModel) => {
      debouncedSetQueryOptions({ ...filterModel.items[0] });
    },
    [debouncedSetQueryOptions]
  );

  const { data, isPending } = useRawData(
    paginationModel.page,
    paginationModel.pageSize,
    queryOptions
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
        filterMode="server"
        onFilterModelChange={onFilterChange}
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
