import {
  Box,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";
import { ptBR } from "@mui/x-data-grid/locales";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { AppContext, AppProvider } from "./contexts/AppContext";
import router from "./router";
import darkPalette from "./styles/darkPalette";
import lightPalette from "./styles/lightPalette";
import typography from "./styles/typography";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      scaleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(error.response.data.detail);
      const errorMessage = error?.response?.data?.detail || error.message;

      if (query.state.data !== undefined) {
        toast.error(`Erro ao atualizar os dados: ${errorMessage}`);
      } else {
        toast.error(`Erro ao carregar os dados: ${errorMessage}`);
      }
    },
  }),
});

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
            <Box sx={{ height: "100%", width: "100%", overflowX: "hidden" }}>
              <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                  <CssBaseline />
                  <RouterProvider router={router()} />
                  <Toaster
                    toastOptions={{
                      loading: {
                        style: {
                          fontFamily: typography.fontFamily,
                          fontSize: 14,
                          color: theme.palette.text,
                          fontWeight: "bold",
                          background: theme.palette.background.paper,
                        },
                      },
                      success: {
                        style: {
                          background: theme.palette.success.light,
                          fontFamily: typography.fontFamily,
                          fontSize: 14,
                          color: theme.palette.success.dark,
                          fontWeight: "bold",
                        },
                      },
                      error: {
                        style: {
                          background: theme.palette.error.light,
                          fontFamily: typography.fontFamily,
                          fontSize: 14,
                          color: theme.palette.error.dark,
                          fontWeight: "bold",
                        },
                      },
                    }}
                  />
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
