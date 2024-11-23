import { Box, Stack, Typography } from "@mui/material";
import {
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid2";

const CustomToolbar = ({ title, subtitle, setFilterButtonEl }) => {
  return (
    <Grid
      container
      mb={2}
      justifyContent={"space-between"}
      width={1}
      direction={"row"}
    >
      <Grid item size={5}>
        <Typography variant={"h5"} color="primary">
          {title}
        </Typography>
        <Typography variant={"body2"} color="textSecondary">
          {subtitle}
        </Typography>
      </Grid>
      <Grid item>
        <GridToolbarContainer>
          <GridToolbarColumnsButton ref={setFilterButtonEl} />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </GridToolbarContainer>
      </Grid>
    </Grid>
  );
};

export default CustomToolbar;
