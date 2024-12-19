import { useTheme } from "@emotion/react";
import { Box, Stack, Typography } from "@mui/material";
import { quantum } from "ldrs";

quantum.register();

const QuantumLoadingBox = ({ verbose }) => {
  const theme = useTheme();

  return (
    <Stack
      width={1}
      height={1}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={2}
    >
      <l-quantum size="50" speed="1.75" color={theme.palette.primary.main} />
      {verbose && (
        <Typography variant={"h6"} color="primary">
          Isso pode demorar um pouco...
        </Typography>
      )}
    </Stack>
  );
};

export default QuantumLoadingBox;
