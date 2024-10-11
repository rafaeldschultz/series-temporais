import {
  AppBar,
  Box,
  Button,
  Drawer,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  padding: "20px 50px",
}));

const PageHeader = ({ routes }) => {
  const { pathname: currentPath } = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigate = (newPath) => {
    navigate(newPath);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        backgroundImage: "none",
        bgcolor: "#2969bd",
      }}
    >
      <StyledToolbar variant="dense" disableGutters>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
          <Button
            onClick={() => currentPath !== path && handleNavigate("/")}
            variant="text"
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
          </Button>
        </Box>
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
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default PageHeader;
