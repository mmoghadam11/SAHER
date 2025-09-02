import React, { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import AuthProvider from "./context/AuthProvider";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { SnackbarProvider } from "context/SnackbarContext";
import { MainProviderContext } from "./context/MainProviderContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { CustomPalette, ThemeMode } from "./types";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalaliV3";
import { LocalizationProvider } from "@mui/x-date-pickers/";
import { faIR } from "@mui/x-date-pickers/locales";


export const ColorModeContext = React.createContext({
  toggleColorMode: () => {
  }, mode: "light",
});

export function RTL(props: any) {
  return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  let mediaTypeMode = useMediaQuery("(prefers-color-scheme: dark)")
  const [mode, setMode] = React.useState<ThemeMode>(
    localStorage.getItem("IACPA_THEME_MODE") as ThemeMode ?? (mediaTypeMode ? "dark" : "light"),
  );

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          let new_mode = (prevMode === "light" ? "dark" : "light")
          localStorage.setItem('IACPA_THEME_MODE', new_mode)
          return new_mode as ThemeMode
        });
      },
    }),
    [],
  );

  const customPalette: CustomPalette = useMemo(() => ({
    light: {
      primary: {
        // main: "#cddc39",
        main: "#023e8a",
        dark: "#006368",
        light: "#00bdc7",
      },
      secondary: {
        main: "#ffbe0b",
        light: "#e7cb8c",
        dark: "#e7cb8c",
      },
    },
    dark: {
      primary: {
        main: "#009199",
        dark: "#006368",
        light: "#00bdc7",
      },
      secondary: {
        main: "#e7cb8c",
        light: "#e7cb8c",
        dark: "#e7cb8c",
      },
    },
  }), []);

  const theme = React.useMemo(
    () =>
      createTheme({
        direction: "rtl",
        typography: {
          fontFamily: `Vazirmatn`,
        },
        palette: {
          mode,
          ...customPalette[mode],
        },
      }),
    [customPalette, mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cacheRtl}>
        <SnackbarProvider>
          <AuthProvider>
            <CssBaseline />
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <MainProviderContext>
                  <ReactQueryDevtools initialIsOpen={false} />
                  <ColorModeContext.Provider value={{ ...colorMode, mode }}>
                    <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                      <AppRoutes />
                    </LocalizationProvider>
                  </ColorModeContext.Provider>
                </MainProviderContext>
              </QueryClientProvider>
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </CacheProvider>
    </ThemeProvider>
  );
}

export default App;
