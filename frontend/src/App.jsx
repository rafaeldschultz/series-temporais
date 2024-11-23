import useAppContext from "./hooks/useAppContext";
import {
  Box,
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
import { AppProvider, AppContext } from "./contexts/AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ptBR } from "@mui/x-data-grid/locales";

const queryClient = new QueryClient();

function App() {
  return (
    <AppProvider>
      <AppContext.Consumer>
        {({ darkMode }) => {
          const theme = responsiveFontSizes(
            createTheme(
              {
                palette: darkMode ? darkPalette : lightPalette,
                typography,
              },
              ptBR
            )
          );
          return (
            <Box sx={{ height: "100%", width: "100%" }}>
              <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                  <CssBaseline />
                  <RouterProvider router={router()} />
                </QueryClientProvider>
              </ThemeProvider>
            </Box>
          );
        }}
      </AppContext.Consumer>
    </AppProvider>
  );
}

export default App;
