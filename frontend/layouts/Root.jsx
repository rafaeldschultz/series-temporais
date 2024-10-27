import { Outlet } from "react-router-dom";
import PageHeader from "../src/components/PageHeader/PageHeader";
import routes from "../src/router/routes";
import { Box, Container } from "@mui/material";

const Root = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <PageHeader routes={routes()} />
      <Box sx={{ flex: "1 1", overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Root;
