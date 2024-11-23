import useRawData from "../../../hooks/useRawData";
import { DataGrid } from "@mui/x-data-grid";
import Page from "../../../layouts/Page";
import { useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";

const RawDataSection = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

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
    <Page>
      <DataGrid
        rows={data.rows}
        columns={data.columns}
        rowCount={rowCount}
        loading={isPending}
        pageSizeOptions={[25, 50, 100]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        sx={(theme) => ({
          boxShadow: theme.palette.card.shadow,
          borderRadius: 2,
          padding: 2,
          backgroundColor: theme.palette.background.paper,
          border: 0,
        })}
        autosizeOptions={{
          includeOutliers: true,
          includeHeaders: true,
        }}
      />
    </Page>
  );
};

export default RawDataSection;
