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
import { AppProvider } from "./contexts/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const { darkMode } = useAppContext();
  const theme = responsiveFontSizes(
    createTheme({
      palette: darkMode ? darkPalette : lightPalette,
      typography,
    })
  );

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <Box height={100}>
            <RouterProvider router={router()} />
          </Box>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
