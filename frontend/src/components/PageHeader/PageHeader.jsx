import {
  AppBar,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ColorModeSwitch from "../Switch/ColorModeSwitch";
import useAppContext from "../../hooks/useAppContext";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: "#2969bd",
  boxShadow: "none",
  backgroundImage: "none",
  zIndex: theme.zIndex.drawer + 1,
  flex: "0 0 auto",
}));

const PageHeader = ({ routes }) => {
  const { darkMode, handleDarkModeSwitch } = useAppContext();

  const { pathname: currentPath } = useLocation();
  const navigate = useNavigate();
  const handleNavigate = (newPath) => {
    navigate(newPath);
  };

  const handleDarkModeChange = (event) => {
    handleDarkModeSwitch();
  };

  return (
    <StyledAppBar>
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          px: 7,
          py: 3,
        }}
      >
        <Typography
          variant="h4"
          textTransform={"none"}
          sx={{
            color: "#FFFFFF",
          }}
        >
          OpenDataSUS
        </Typography>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 1,
            alignItems: "center",
          }}
        >
          {routes
            ?.filter((item) => !item.removed)
            .map(({ title, path }) => (
              <Button
                key={path} // Ensure a unique key for each route
                onClick={() =>
                  currentPath !== path && handleNavigate(path ?? "/")
                }
                variant="text"
                color="info"
              >
                <Typography
                  variant={"body2"}
                  textTransform={"none"}
                  sx={{
                    color: "#FFFFFF",
                  }}
                >
                  {title}
                </Typography>
              </Button>
            ))}
          <ColorModeSwitch
            sx={{ m: 1 }}
            checked={darkMode}
            onChange={handleDarkModeChange}
          />
        </Box>
      </Toolbar>
    </StyledAppBar>

    // // <AppBar
    // //   position="fixed"
    // //   sx={{
    // //     backgroundImage: "none",
    // //     bgcolor: "#2969bd",
    // //   }}
    // // >
    // //   <StyledToolbar variant="dense" disableGutters>
    // //     <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
    // //       <Button
    // //         onClick={() => currentPath !== "/" && handleNavigate("/")}
    // //         variant="text"
    // //       >
    // //         <Typography
    // //           variant="h4"
    // //           textTransform={"none"}
    // //           sx={{
    // //             color: "#FFFFFF",
    // //           }}
    // //         >
    // //           OpenDataSUS
    // //         </Typography>
    // //       </Button>
    // //     </Box>
    // //     <Box
    // //       sx={{
    // //         display: { xs: "none", md: "flex" },
    // //         gap: 1,
    // //         alignItems: "center",
    // //       }}
    // //     >
    // //       {routes
    // //         ?.filter((item) => !item.removed)
    // //         .map(({ title, path }) => (
    // //           <Button
    // //             key={path} // Ensure a unique key for each route
    // //             onClick={() =>
    // //               currentPath !== path && handleNavigate(path ?? "/")
    // //             }
    // //             variant="text"
    // //             color="info"
    // //           >
    // //             <Typography
    // //               variant={"body2"}
    // //               textTransform={"none"}
    // //               sx={{
    // //                 color: "#FFFFFF",
    // //               }}
    // //             >
    // //               {title}
    // //             </Typography>
    // //           </Button>
    // //         ))}
    // //     </Box>
    //   </StyledToolbar>
    // </AppBar>
  );
};

export default PageHeader;
