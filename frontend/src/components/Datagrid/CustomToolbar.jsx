import { Box, Button, Stack, Typography } from "@mui/material";
import {
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid2";
import ShortcutRoundedIcon from "@mui/icons-material/ShortcutRounded";

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
          <Button
            startIcon={<ShortcutRoundedIcon />}
            target="_blank"
            href="https://opendatasus.saude.gov.br/dataset/srag-2021-a-2024"
          >
            OpenDataSUS
          </Button>
        </GridToolbarContainer>
      </Grid>
    </Grid>
  );
};

export default CustomToolbar;
