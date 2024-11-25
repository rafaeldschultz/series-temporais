import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { quantum } from "ldrs";

quantum.register();

const QuantumLoadingBox = () => {
  const theme = useTheme();

  return (
    <Box
      width={1}
      height={1}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <l-quantum size="50" speed="1.75" color={theme.palette.primary.main} />
    </Box>
  );
};

export default QuantumLoadingBox;
