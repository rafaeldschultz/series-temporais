import {
  AppBar,
  Box,
  Button,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useAppContext from "../../hooks/useAppContext";
import ColorModeSwitch from "../Switch/ColorModeSwitch";

const StyledAppBar = styled(AppBar)(({ theme }) => {
  const { darkMode } = useAppContext();
  return {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    borderBottom: "1px solid",
    borderColor: theme.palette.divider,
    backgroundColor: darkMode
      ? theme.palette.background.default
      : theme.palette.primary.main,
    boxShadow: "none",
    backgroundImage: "none",
    zIndex: theme.zIndex.drawer + 1,
    flex: "0 0 auto",
  };
});

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
          py: 2,
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
          <Tooltip title="Alterar tema" arrow>
            <ColorModeSwitch
              sx={{ m: 1 }}
              checked={darkMode}
              onChange={handleDarkModeChange}
            />
          </Tooltip>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default PageHeader;
