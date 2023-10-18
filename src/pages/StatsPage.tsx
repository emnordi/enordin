import { Box, Grid, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { AutoCompleteOptions } from "../components/autocomplete/F1AutoComplete";
import { Season } from "../types/season";
import SeasonAutoComplete, { statsPageDefaultOption } from "../components/autocomplete/SeasonAutoComplete";
import DriverAutoComplete, { driversEmptyOption } from "../components/autocomplete/DriverAutoComplete";
import { Driver } from "../types/driver";
import { getChampions, getRaceStats } from "../service/statsService";
import { RaceResult } from "../types/raceResult";
import DriverStatsTable from "../components/table/DriverStatsTable";
import { WorldChampion } from "../types/worldChampions";
import { Race } from "../types/race";
import { getRacesForSeason } from "../service/raceService";
import ConfettiExplosion from "react-confetti-explosion";

interface Props {
  drivers: Driver[];
  theme: Theme;
  seasons?: Season[];
}

const StatsPage = ({ drivers, theme, seasons }: Props) => {
  const [selectedDriver, setSelectedDriver] = useState<AutoCompleteOptions>(driversEmptyOption);
  const [selectedSeason, setSelectedSeason] = useState<AutoCompleteOptions>(statsPageDefaultOption);
  const [racesForSelectedDriver, setRacesForSelectedDriver] = useState<RaceResult[]>([]);
  const [championships, setChampionships] = useState<WorldChampion[]>([]);
  const [racesForSeason, setRacesForSeason] = useState<Race[]>([]);
  const [isExploding, setIsExploding] = useState(false);

  const setCircuitsInOrder = async () => {
    const racesResponse = await getRacesForSeason(selectedSeason.id);
    const racesForSeason = racesResponse?.races || [];
    setRacesForSeason(racesForSeason);
  };

  useEffect(() => {
    if (selectedSeason.id === "") {
      setRacesForSeason([]);
      return;
    }
    setCircuitsInOrder();
  }, [selectedSeason]);

  const getDriverStats = async (signal: AbortSignal) => {
    if (selectedDriver.id === "") return;

    const raceResults = (await getRaceStats(selectedDriver.id)).raceResults;
    setRacesForSelectedDriver(raceResults ?? []);

    const championShips = (await getChampions(selectedDriver.id)).worldChampions;
    setChampionships(championShips ?? []);
  };

  useEffect(() => {
    if (selectedDriver.id === "830") {
      setIsExploding(true);
    }

    const controller = new AbortController();
    const signal = controller.signal;

    getDriverStats(signal);

    return () => {
      controller.abort();
    };
  }, [selectedDriver]);

  return (
    <Box sx={{ width: "80%", margin: "0 auto", paddingTop: "5%" }}>
      <Box sx={{ marginLeft: "50%" }}>
        {isExploding && (
          <ConfettiExplosion
            width={2000}
            particleCount={300}
            duration={4000}
            onComplete={() => setIsExploding(false)}
          />
        )}
      </Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <DriverAutoComplete
            modifiedDrivers={drivers}
            selectedDriver={selectedDriver}
            setSelectedDriver={setSelectedDriver}
          />
        </Grid>
        <Grid item xs={6}>
          <SeasonAutoComplete
            seasons={seasons ?? []}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            statsPage
            disabled={selectedDriver.id === ""}
          />
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ paddingTop: "1%" }}>
        <DriverStatsTable
          raceResults={racesForSelectedDriver}
          driver={drivers.find(({ driverId }) => driverId === +selectedDriver.id)}
          championships={
            selectedSeason.id === "" ? championships : championships.filter(({ year }) => year === +selectedSeason.id)
          }
          racesForSeason={racesForSeason}
          theme={theme}
        />
      </Grid>
    </Box>
  );
};

export default StatsPage;
