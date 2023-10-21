import { useEffect, useState } from "react";
import { Box, Grid, Theme } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import { AutoCompleteOptions } from "../components/autocomplete/F1AutoComplete";
import { Driver } from "../types/driver";
import DriverAutoComplete, { driversEmptyOption } from "../components/autocomplete/DriverAutoComplete";
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
import { isMobile } from "react-device-detect";

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
  }, [selectedRace, selectedEvent]);

  useEffect(() => {
    const raceResult =
      selectedDriver.id === ""
        ? selectedRaceResults
        : selectedRaceResults.filter((row) => row.driverId === +selectedDriver.id);
    const qualiResult =
      selectedDriver.id === ""
        ? selectedQualifyingResults
        : selectedQualifyingResults.filter((row) => row.driverId === +selectedDriver.id);
    setSelectedRaceResultsModified(raceResult);
    setSelectedQualifyingResultsModified(qualiResult);
  }, [selectedRaceResults, selectedQualifyingResults]);

  useEffect(() => {
    const currentDriver = drivers.find((driver) => driver.driverId === +selectedDriver.id);
    if (currentDriver && modifiedDrivers.includes(currentDriver)) return;
    setSelectedDriver(driversEmptyOption);
  }, [modifiedDrivers]);

  useEffect(() => {
    if (selectedDriver.id == "") {
      setSelectedRaceResultsModified(selectedRaceResults);
      setSelectedQualifyingResultsModified(selectedQualifyingResults);
      return;
    }

    const filteredResults = selectedRaceResults.filter((row) => row.driverId === +selectedDriver.id);
    const filteredQualiResults = selectedQualifyingResults.filter((row) => row.driverId === +selectedDriver.id);

    setSelectedRaceResultsModified(filteredResults);
    setSelectedQualifyingResultsModified(filteredQualiResults);
  }, [selectedDriver]);

  return (
    <>
      <Box
        sx={{
          paddingTop: `${isMobile ? 20 : 10}%`,
        }}
      >
        {selectedRace && (
          <MapCarousel
            height={"230px"}
            width={`${isMobile ? 40 : 50}%`}
            margin={"0 auto"}
            offset={isMobile ? 2 : 4}
            racesForSeason={racesForSeason}
            selectedRace={selectedRace}
            setSelectedRace={setSelectedRace}
            theme={theme}
          />
        )}
      </Box>

      <Box
        sx={{
          paddingTop: `${isMobile ? 15 : 6}%`,
          width: "80%",
          margin: "0 auto",
        }}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <EventAutoComplete
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
              sprint={selectedSprintResults.length > 0}
            />
          </Grid>
          <Grid item xs={6}>
            <SeasonAutoComplete
              seasons={seasons ?? []}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
            />
          </Grid>
          <Grid item xs={6}>
            {selectedRace && (
              <CircuitAutoComplete
                racesForSeason={racesForSeason}
                setSelectedRace={setSelectedRace}
                selectedRace={selectedRace}
              />
            )}
          </Grid>
          <Grid item xs={6}>
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
