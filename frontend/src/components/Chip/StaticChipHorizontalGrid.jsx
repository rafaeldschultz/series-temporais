import { Chip, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";

const StaticChipHorizontalGrid = ({ items }) => {
  return (
    <Tooltip title="Esses parâmetros não são editáveis.">
      <Grid container spacing={1}>
        {items.map((item) => (
          <Grid key={item.label}>
            <Chip
              label={item.label + ": " + item.currentValue}
              size="small"
              variant="filled"
            />
          </Grid>
        ))}
      </Grid>
    </Tooltip>
  );
};

export default StaticChipHorizontalGrid;
