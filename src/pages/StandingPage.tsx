import { Box, Grid, Tab, Tabs, Theme } from "@mui/material";
import React, { useEffect, useState } from "react";
import DriverStandingsTable from "../components/table/DriverStandingsTable";
import ConstructorStandingsTable from "../components/table/ConstructorStandingsTable";
import F1AutoComplete, { AutoCompleteOptions } from "../components/autocomplete/F1AutoComplete";
import { Season } from "../types/season";
import SeasonAutoComplete, { seasonDefaultOption } from "../components/autocomplete/SeasonAutoComplete";
import { Race } from "../types/race";
import { getRacesForSeason } from "../service/raceService";
import { DriverStanding } from "../types/driverStanding";
import { ConstructorStanding } from "../types/constructorStanding";
import { getDriverStandingsFromApi } from "../service/driverStandingService";
import { getConstructorStandingsFromApi } from "../service/constructorStandingService";
import { getResultsForRaceId } from "../service/raceResultService";

interface Props {
  theme: Theme;
  seasons?: Season[];
}

const StandingsPage = ({ theme, seasons }: Props) => {
  const [value, setValue] = React.useState(0);

  const [racesForSeason, setRacesForSeason] = useState<Race[]>([]);

  const [selectedRace, setSelectedRace] = useState<Race>();

  const [selectedSeason, setSelectedSeason] = useState<AutoCompleteOptions>(seasonDefaultOption);

  const [driverStandings, setDriverStandings] = React.useState<DriverStanding[]>([]);

  const [constructorStandings, setConstructorStandings] = React.useState<ConstructorStanding[]>([]);

  const [driverConstructorMap, setDriverConstructorMap] = useState<Map<number, string[]>>(new Map());

  const numberOfRaces = racesForSeason.length;

  const handleChangeSelectedRace = (newRaceId: string) => {
    setSelectedRace(racesForSeason.find(({ raceId }) => raceId.toString() === newRaceId));
  };

  const setCircuitsInOrder = async () => {
    const racesForSeason: Race[] = (await getRacesForSeason(selectedSeason.id))?.races?.reverse();

    const filteredRacesForSeason = racesForSeason.filter((race) => new Date(race.date) <= new Date());

    setRacesForSeason(filteredRacesForSeason);
    setSelectedRace(filteredRacesForSeason[0]);
  };

  useEffect(() => {
    setCircuitsInOrder();
  }, [selectedSeason]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getStandingsData = async (signal: AbortSignal) => {
    const data = selectedRace && (await getDriverStandingsFromApi(selectedRace.raceId)).driverStandings;

    setDriverStandings(data ?? []);

    const constructorData =
      selectedRace && (await getConstructorStandingsFromApi(selectedRace.raceId)).constructorStandings;

    setConstructorStandings(constructorData ?? []);
  };

  useEffect(() => {
    const abortController = new window.AbortController();
    const signal = abortController.signal;
    getStandingsData(signal);
    return () => {
      if (signal && abortController.abort) {
        abortController.abort();
      }
    };
  }, [selectedRace]);

  const getAllConstructorsForCurrentSeason = async () => {
    const driverConstructors: Map<number, string[]> = new Map();

    for (const race of racesForSeason) {
      const res = (await getResultsForRaceId(race.raceId, false)).raceResults;
      for (const result of res) {
        if (driverConstructors.has(result.driverId)) {
          const constructors = driverConstructors.get(result.driverId);
          if (constructors && !constructors.includes(result.team.name)) {
            constructors.push(result.team.name);
            driverConstructors.set(result.driverId, constructors);
          }
        } else {
          driverConstructors.set(result.driverId, [result.team.name]);
        }
      }
    }
    setDriverConstructorMap(driverConstructors);
  };

  useEffect(() => {
    getAllConstructorsForCurrentSeason();
  }, [racesForSeason]);

  const raceToAutoCompleteOption = (race: Race, index: number): AutoCompleteOptions => {
    return {
      label: race.name + " (Round " + (numberOfRaces - (index + 1)) + ")",
      id: race.raceId.toString(),
    };
  };

  const allRoundOptions: AutoCompleteOptions[] = racesForSeason.map((race, index) => {
    return raceToAutoCompleteOption(race, index);
  });

  return (
    <Box sx={{ width: "80%", margin: "0 auto", paddingTop: "5%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <SeasonAutoComplete
            seasons={seasons ?? []}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
          />
        </Grid>
        <Grid item xs={6}>
          {selectedRace && (
            <F1AutoComplete
              allOptions={allRoundOptions}
              handleSelectChange={handleChangeSelectedRace}
              label="Standing after round"
              val={raceToAutoCompleteOption(selectedRace, racesForSeason.indexOf(selectedRace))}
            />
          )}
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          <Tab sx={{ fontFamily: "Formula1Regular" }} label="Drivers Standings" />
          <Tab sx={{ fontFamily: "Formula1Regular" }} label="Constructors Standings" />
        </Tabs>
      </Box>

      <div hidden={value !== 0}>
        <DriverStandingsTable
          standingData={driverStandings}
          driverConstructorMap={driverConstructorMap}
          notFound="No standings found"
          theme={theme}
        />
      </div>
      <div hidden={value !== 1}>
        <ConstructorStandingsTable standingData={constructorStandings} notFound="No standings found" theme={theme} />
      </div>
    </Box>
  );
};

export default StandingsPage;
