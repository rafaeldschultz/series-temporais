import useAppContext from "./hooks/useAppContext";
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
} from "@mui/material";
import darkPalette from "./styles/darkPalette";
import lightPalette from "./styles/lightPalette";
import typography from "./styles/typography";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import router from "./router";

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
      <CssBaseline />
      <Box height={100}>
        <RouterProvider router={router()} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
