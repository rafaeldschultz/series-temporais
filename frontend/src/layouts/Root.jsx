import { Outlet } from "react-router-dom";
import PageHeader from "../components/PageHeader/PageHeader";
import routes from "../router/routes";
import { Box, Container } from "@mui/material";

const Root = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PageHeader routes={routes()} />
      <Outlet />
    </Box>
  );
};

export default Root;
