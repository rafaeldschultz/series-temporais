import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { grid } from "ldrs";

grid.register();

const GridLoadingBox = () => {
  const theme = useTheme();

  return (
    <Box
      width={1}
      height={1}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <l-grid size="60" speed="1.5" color={theme.palette.primary.main} />
    </Box>
  );
};

export default GridLoadingBox;
