import { useEffect, useState } from "react";
import { Box, Grid, Theme } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import {
  AutoCompleteOptions,
  driversEmptyOption,
} from "../components/autocomplete/F1AutoComplete";
import { yearSprintRaceMap } from "../components/F1Data/SprintRaces";
import { Driver } from "../types/driver";
import DriverAutoComplete from "../components/autocomplete/DriverAutoComplete";
import { Season } from "../types/season";
import SeasonAutoComplete, {
  seasonDefaultOption,
} from "../components/autocomplete/SeasonAutoComplete";
import ResultSection from "../components/resultSection/ResultSection";
import { getResultFromObjectBasedOnEventType } from "../components/resultSection/resultSectionUtils";
import CircuitAutoComplete from "../components/autocomplete/CircuitAutoComplete";
import useInitialStates from "./hooks/useInitialStates";
import EventAutoComplete, {
  eventDefaultOption,
} from "../components/autocomplete/EventAutoComplete";
import { getF1Data } from "../service/f1Service";
import { RaceTable } from "../types/F1Data";
import { Race } from "../types/race";
import { getRacesForSeason } from "../service/raceService";

interface Props {
  theme: Theme;
  drivers: Driver[];
  seasons: Season[];
}

const MainPage = ({ theme, drivers, seasons }: Props) => {
  const [selectedDriver, setSelectedDriver] =
    useState<AutoCompleteOptions>(driversEmptyOption);
  const [selectedRaceData, setSelectedRaceData] = useState<RaceTable>({
    season: "",
    circuitId: "",
    Races: [],
  });
  const [selectedSeason, setSelectedSeason] =
    useState<AutoCompleteOptions>(seasonDefaultOption);

  const [modifiedDrivers, setModifiedDrivers] = useState<Driver[]>(drivers);

  const [selectedRace, setSelectedRace] = useState<Race>();

  const [racesForSeason, setRacesForSeason] = useState<Race[]>([]);

  const [selectedEvent, setSelectedEvent] =
    useState<AutoCompleteOptions>(eventDefaultOption);

  // Fetch F1 data from the API
  const getData = async (circuitId: string) => {
    const data = await getF1Data(circuitId, selectedSeason, selectedEvent);
    setSelectedRaceData(data);
  };

  const setCircuitsInOrder = async () => {
    const racesForSeason: Race[] = (await getRacesForSeason(selectedSeason.id))
      ?.races;

    setRacesForSeason(racesForSeason);
    setSelectedRace(racesForSeason[0]);

    getData(racesForSeason[0]?.circuit?.circuitRef);
  };

  useInitialStates({
    drivers,
    modifiedDrivers,
    setModifiedDrivers,
  });

  // Effects
  useEffect(() => {
    setCircuitsInOrder();
  }, [selectedSeason]);

  useEffect(() => {
    getData(
      selectedRace?.circuit.circuitRef ?? racesForSeason[0]?.circuit?.circuitRef
    );
  }, [selectedRace, selectedEvent]);

  useEffect(() => {
    setSelectedDriver(driversEmptyOption);
  }, [selectedEvent]);

  useEffect(() => {
    const res = getResultFromObjectBasedOnEventType(
      selectedRaceData,
      selectedEvent.id
    );

    const driverIdsInSelectedRace: string[] =
      res.map((row) => row?.Driver?.driverId) ?? [];

    setModifiedDrivers(
      drivers?.filter((driver) =>
        driverIdsInSelectedRace?.includes(driver.driverRef)
      )
    );
  }, [selectedRaceData]);

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
              sprint={
                yearSprintRaceMap
                  .get(selectedSeason.id)
                  ?.includes(selectedRace?.circuit.circuitRef ?? "") ?? false
              }
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
                selectedRaceData={selectedRaceData}
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
