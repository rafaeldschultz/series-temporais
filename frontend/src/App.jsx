import useAppContext from "./hooks/useAppContext";
import { Box, createTheme, responsiveFontSizes } from "@mui/material";
import darkPalette from "./styles/darkPalette";
import lightPalette from "./styles/lightPalette";
import typography from "./styles/typography";
import { RouterProvider } from "react-router-dom";
import routes from "./router/routes";
import { ThemeProvider } from "@mui/material";

function App() {
  const { darkMode } = useAppContext();
  const theme = responsiveFontSizes(
    createTheme({
      palette: darkMode ? darkPalette : lightPalette,
      typography,
    })
  );

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <RouterProvider router={routes} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
