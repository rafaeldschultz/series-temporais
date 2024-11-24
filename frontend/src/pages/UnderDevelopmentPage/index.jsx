import { Box, Stack, Typography } from "@mui/material";
import HandymanRoundedIcon from "@mui/icons-material/HandymanRounded";

const UnderDevelopmentPage = () => {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      height={1}
      width={1}
      spacing={4}
    >
      <HandymanRoundedIcon sx={{ fontSize: "8rem" }} color="secondary" />
      <Typography
        sx={{ fontSize: "5rem", textAlign: "center" }}
        color="primary"
      >
        DISPONÍVEL EM BREVE
      </Typography>
      <Typography variant="h5" color="secondary">
        Essa página ainda está em desenvolvimento!
      </Typography>
    </Stack>
  );
};

export default UnderDevelopmentPage;
