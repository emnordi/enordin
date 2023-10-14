import { useEffect, useState } from "react";
import { Box, Grid, Theme } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import { AutoCompleteOptions, driversEmptyOption } from "../components/autocomplete/F1AutoComplete";
import { Driver } from "../types/driver";
import DriverAutoComplete from "../components/autocomplete/DriverAutoComplete";
import { Season } from "../types/season";
import SeasonAutoComplete, { seasonDefaultOption } from "../components/autocomplete/SeasonAutoComplete";
import ResultSection from "../components/resultSection/ResultSection";
import CircuitAutoComplete from "../components/autocomplete/CircuitAutoComplete";
import EventAutoComplete, { eventDefaultOption } from "../components/autocomplete/EventAutoComplete";
import { Race } from "../types/race";
import { getRacesForSeason } from "../service/raceService";
import { getResultsForRaceId } from "../service/raceResultService";
import { RaceResult } from "../types/raceResult";
import { QualifyingResult } from "../types/qualifyingResult";
import { getQualiResultsForRaceId } from "../service/qualifyingResultService";

interface Props {
  theme: Theme;
  drivers: Driver[];
  seasons: Season[];
}

const MainPage = ({ theme, drivers, seasons }: Props) => {
  const [selectedDriver, setSelectedDriver] = useState<AutoCompleteOptions>(driversEmptyOption);
  const [modifiedDrivers, setModifiedDrivers] = useState<Driver[]>(drivers);
  const [selectedSeason, setSelectedSeason] = useState<AutoCompleteOptions>(seasonDefaultOption);
  const [selectedRace, setSelectedRace] = useState<Race>();
  const [selectedRaceResults, setSelectedRaceResults] = useState<RaceResult[]>([]);
  const [selectedSprintResults, setSelectedSprintResults] = useState<RaceResult[]>([]);
  const [selectedQualifyingResults, setSelectedQualifyingResults] = useState<QualifyingResult[]>([]);
  const [selectedRaceResultsModified, setSelectedRaceResultsModified] = useState<RaceResult[]>([]);
  const [selectedQualifyingResultsModified, setSelectedQualifyingResultsModified] = useState<QualifyingResult[]>([]);
  const [racesForSeason, setRacesForSeason] = useState<Race[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AutoCompleteOptions>(eventDefaultOption);

  const positionForDNFs = (results: RaceResult[]) => {
    // Set position for results with no position based on number of laps completed
    const resultsWithPosition = results.filter((e) => e.position !== "\\N").sort((a, b) => +a.position - +b.position);
    const resultsWithNoPosition = results.filter((e) => e.position === "\\N").sort((a, b) => b.laps - a.laps);
    resultsWithNoPosition.forEach((e, i) => {
      e.position = (resultsWithPosition.length + 1 + i).toString();
    });

    return resultsWithPosition.concat(resultsWithNoPosition);
  };

  const getData = async () => {
    if (!selectedRace) return;

    const fetchRaceResults = async (sprint: boolean) => {
      const response = await getResultsForRaceId(selectedRace?.raceId ?? racesForSeason[0]?.raceId, sprint);
      return positionForDNFs(response.raceResults);
    };

    const raceResults = await fetchRaceResults(false);
    setSelectedSprintResults(await fetchRaceResults(true));
    setSelectedRaceResults(raceResults);

    const qualifyingResultsResponse = await getQualiResultsForRaceId(selectedRace?.raceId ?? racesForSeason[0]?.raceId);
    setSelectedQualifyingResults(qualifyingResultsResponse.qualifyingResults);

    const driverIdsForSelectedRace = raceResults.map(({ driverId }) => driverId);
    setModifiedDrivers(drivers.filter((driver) => driverIdsForSelectedRace.includes(driver.driverId)));
  };

  const setCircuitsInOrder = async () => {
    const racesResponse = await getRacesForSeason(selectedSeason.id);
    const racesForSeason = racesResponse?.races || [];
    setRacesForSeason(racesForSeason);
    setSelectedRace(racesForSeason[0]);
  };

  useEffect(() => {
    setCircuitsInOrder();
  }, [selectedSeason]);

  useEffect(() => {
    getData();
    setSelectedDriver(driversEmptyOption);
  }, [selectedRace, selectedEvent]);

  useEffect(() => {
    setSelectedRaceResultsModified(selectedRaceResults);
    setSelectedQualifyingResultsModified(selectedQualifyingResults);
  }, [selectedRaceResults, selectedQualifyingResults]);

  useEffect(() => {
    if (selectedDriver.id == "") {
      setSelectedRaceResultsModified(selectedRaceResults);
      setSelectedQualifyingResultsModified(selectedQualifyingResults);
      return;
    }

    const filteredResults = selectedRaceResults.filter((row) => row.driver.driverRef === selectedDriver.id);
    const filteredQualiResults = selectedQualifyingResults.filter((row) => row.driver.driverRef === selectedDriver.id);

    setSelectedRaceResultsModified(filteredResults);
    setSelectedQualifyingResultsModified(filteredQualiResults);
  }, [selectedDriver]);

  return (
    <>
      <Box
        sx={{
          marginTop: "180px",
        }}
      >
        {selectedRace && (
          <MapCarousel
            height={"230px"}
            width={"50%"}
            margin={"0 auto"}
            offset={4}
            racesForSeason={racesForSeason}
            selectedRace={selectedRace}
            setSelectedRace={setSelectedRace}
          />
        )}
      </Box>

      <Box
        sx={{
          paddingTop: "6rem",
          width: "80%",
          margin: "0 auto",
        }}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={3}>
            <EventAutoComplete
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
              sprint={selectedSprintResults.length > 0}
            />
          </Grid>
          <Grid item xs={3}>
            <SeasonAutoComplete
              seasons={seasons ?? []}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
            />
          </Grid>
          <Grid item xs={3}>
            {selectedRace && (
              <CircuitAutoComplete
                racesForSeason={racesForSeason}
                setSelectedRace={setSelectedRace}
                selectedRace={selectedRace}
              />
            )}
          </Grid>
          <Grid item xs={3}>
            <DriverAutoComplete
              modifiedDrivers={modifiedDrivers}
              selectedDriver={selectedDriver}
              setSelectedDriver={setSelectedDriver}
            />
          </Grid>
          <Grid item xs={12}>
            {selectedRace && (
              <ResultSection
                eventValue={selectedEvent.id}
                selectedSeason={selectedSeason}
                selectedRaceResults={
                  selectedEvent.id === "sprint" ? selectedSprintResults : selectedRaceResultsModified
                }
                qualifyingResults={selectedQualifyingResultsModified}
                theme={theme}
                selectedDriver={selectedDriver}
                selectedRace={selectedRace}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MainPage;
