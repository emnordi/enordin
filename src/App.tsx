import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MainPage from "./pages/MainPage";
import ResponsiveAppBar from "./components/Navbar/NavBar";
import Footer from "./components/footer/Footer";
import { Analytics } from "@vercel/analytics/react";
import StandingsPage from "./pages/StandingPage";
import { Driver } from "./types/driver";
import { getDriversFromApi } from "./service/driverService";
import { Season } from "./types/season";
import { getSeasonsFromApi } from "./service/seasonService";

function App() {
  const [drivers, setDrivers] = React.useState<Driver[]>();

  const [seasons, setSeasons] = React.useState<Season[]>();

  useEffect(() => {
    getDriversFromApi().then((drivers) => {
      setDrivers(
        drivers?.drivers.sort((a, b) => a.surname.localeCompare(b.surname))
      );
    });
  }, []);

  useEffect(() => {
    getSeasonsFromApi().then((seasons) => {
      setSeasons(seasons?.seasons.sort((a, b) => b.year - a.year));
    });
  }, []);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const isMobileMatch = useMediaQuery("(max-width:600px)");

  const [mode, setMode] = React.useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <ResponsiveAppBar theme={theme} colorMode={colorMode} />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                drivers && (
                  <MainPage
                    theme={theme}
                    drivers={drivers}
                    seasons={seasons ?? []}
                  />
                )
              }
            />
            <Route
              path="/standings"
              element={<StandingsPage theme={theme} seasons={seasons} />}
            />
          </Routes>
        </BrowserRouter>
        <Footer theme={theme} />
      </div>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
