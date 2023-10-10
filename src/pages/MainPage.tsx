import { useEffect, useState } from "react";
import { Box, Grid, Theme } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import {
  AutoCompleteOptions,
  driversEmptyOption,
} from "../components/autocomplete/F1AutoComplete";
import { yearCircuitMap } from "../components/F1Data/YearCircuitMap";
import { yearSprintRaceMap } from "../components/F1Data/SprintRaces";
import { Driver } from "../types/driver";
import DriverAutoComplete from "../components/autocomplete/DriverAutoComplete";
import { Season } from "../types/season";
import SeasonAutoComplete, {
  seasonDefaultOption,
} from "../components/autocomplete/SeasonAutoComplete";
import ResultSection from "../components/resultSection/ResultSection";
import { getResultFromObjectBasedOnEventType } from "../components/resultSection/resultSectionUtils";
import { Circuit } from "../types/circuit";
import CircuitAutoComplete, {
  circuitToAutoCompleteOption,
} from "../components/autocomplete/CircuitAutoComplete";
import useInitialStates from "./hooks/useInitialStates";
import EventAutoComplete, {
  eventDefaultOption,
} from "../components/autocomplete/EventAutoComplete";
import { getF1Data } from "../service/f1Service";
import { RaceTable } from "../types/F1Data";

interface Props {
  theme: Theme;
  drivers: Driver[];
  seasons: Season[];
  circuits: Circuit[];
}

const MainPage = ({ theme, drivers, seasons, circuits }: Props) => {
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

  const [circuitsForYear, setCircuitsForYear] = useState<Circuit[]>(circuits);

  const [selectedCircuit, setSelectedCircuit] = useState<
    AutoCompleteOptions | undefined
  >();

  const [selectedEvent, setSelectedEvent] =
    useState<AutoCompleteOptions>(eventDefaultOption);

  // Fetch F1 data from the API
  const getData = async (circuitId: string) => {
    const data = await getF1Data(circuitId, selectedSeason, selectedEvent);
    setSelectedRaceData(data);
  };

  const setCircuitsInOrder = () => {
    const circuitsOrdered: Circuit[] = [];
    yearCircuitMap.get(selectedSeason.id)?.forEach((value) => {
      const c = circuits.find((circuit) => circuit?.circuitRef === value);
      if (c != null) circuitsOrdered.push(c);
    });
    setCircuitsForYear(circuitsOrdered);
    getData(circuitsOrdered[0]?.circuitRef);
  };

  useInitialStates({
    circuits,
    circuitsForYear,
    setCircuitsInOrder,
    drivers,
    modifiedDrivers,
    setModifiedDrivers,
  });

  useEffect(() => {
    !selectedCircuit &&
      circuitsForYear?.length > 0 &&
      setSelectedCircuit(circuitToAutoCompleteOption(circuitsForYear[0]));
  }, [circuitsForYear]);

  // Effects
  useEffect(() => {
    setCircuitsInOrder();
  }, [selectedSeason]);

  useEffect(() => {
    getData(selectedCircuit?.id ?? circuitsForYear[0]?.circuitRef);
  }, [selectedCircuit, selectedEvent]);

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
        {selectedCircuit && (
          <MapCarousel
            height={"230px"}
            width={"50%"}
            margin={"0 auto"}
            offset={4}
            circuits={circuitsForYear}
            selectedCircuit={selectedCircuit}
            setSelectedCircuit={setSelectedCircuit}
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
                  ?.includes(selectedCircuit?.id ?? "") ?? false
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
            {selectedCircuit && (
              <CircuitAutoComplete
                circuits={circuitsForYear}
                selectedCircuit={selectedCircuit}
                setSelectedCircuit={setSelectedCircuit}
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
            {selectedCircuit && (
              <ResultSection
                eventValue={selectedEvent.id}
                selectedSeason={selectedSeason}
                selectedRaceData={selectedRaceData}
                theme={theme}
                selectedDriver={selectedDriver}
                selectedCircuit={selectedCircuit}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MainPage;
