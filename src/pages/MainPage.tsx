import { useEffect, useState } from "react";
import { Box, Grid, Theme } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import F1AutoComplete, {
  driversEmptyOption,
} from "../components/autocomplete/F1AutoComplete";
import { yearCircuitMap } from "../components/F1Data/YearCircuitMap";
import useStateHelper from "./useStateHelper";
import { CircuitFE } from "../types/CircruitFE";
import { yearSprintRaceMap } from "../components/F1Data/SprintRaces";
import { Driver } from "../types/driver";
import DriverAutoComplete from "../components/autocomplete/DriverAutoComplete";
import { Season } from "../types/season";
import SeasonAutoComplete from "../components/autocomplete/SeasonAutoComplete";
import ResultSection from "../components/resultSection/ResultSection";
import { getResultFromObjectBasedOnEventType } from "../components/resultSection/resultSectionUtils";

interface Props {
  theme: Theme;
  drivers?: Driver[];
  seasons?: Season[];
}

const MainPage = ({ theme, drivers, seasons }: Props) => {
  const {
    goToCircuit,
    setGoToCircuit,
    selectedDriver,
    setSelectedDriver,
    selectedRaceData,
    selectedSeason,
    setSelectedSeason,
    allCircuits,
    allCircuitsForYear,
    setAllCircuitsForYear,
    eventValue,
    getF1Data,
    allTrackOptions,
    allEventOptions,
    handleSelectChangeCircuit,
    handleChangeEvent,
    eventOptions,
    setEventOptions,
  } = useStateHelper();

  const [modifiedDrivers, setModifiedDrivers] = useState(drivers);

  useEffect(() => {
    !modifiedDrivers && setModifiedDrivers(drivers);
  }, [drivers]);

  // Effects
  useEffect(() => {
    const circuits: CircuitFE[] = [];
    yearCircuitMap.get(selectedSeason.id)?.forEach((value) => {
      const c = allCircuits.find((circuit) => circuit?.circuitId === value);
      if (c != null) circuits.push(c);
    });

    const filteredCircuits = allCircuits.filter((circuit) =>
      yearCircuitMap.get(selectedSeason.id)?.includes(circuit?.circuitId)
    );
    setAllCircuitsForYear(circuits);
    getF1Data(filteredCircuits[0]?.circuitId);
  }, [selectedSeason]);

  useEffect(() => {
    const selectedCircuitId = allCircuitsForYear[goToCircuit]?.circuitId;
    if (
      !yearSprintRaceMap.get(selectedSeason.id)?.includes(selectedCircuitId)
    ) {
      setEventOptions(eventOptions.filter((option) => option.id !== "sprint"));
      eventValue === "sprint" && handleChangeEvent("results");
    } else {
      setEventOptions(allEventOptions);
    }
    getF1Data(selectedCircuitId);
  }, [goToCircuit, eventValue]);

  useEffect(() => {
    setSelectedDriver(driversEmptyOption);
  }, [eventValue]);

  useEffect(() => {
    const res = getResultFromObjectBasedOnEventType(
      selectedRaceData,
      eventValue
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
        <MapCarousel
          height={"230px"}
          width={"50%"}
          margin={"0 auto"}
          offset={4}
          goToSlide={goToCircuit}
          setGoToSlide={setGoToCircuit}
          allCircuits={allCircuitsForYear}
        />
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
            <F1AutoComplete
              allOptions={eventOptions}
              handleSelectChange={handleChangeEvent}
              label="Event Type"
              val={eventOptions?.find((element) => element.id === eventValue)}
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
            <F1AutoComplete
              allOptions={allTrackOptions}
              handleSelectChange={handleSelectChangeCircuit}
              label="Tracks"
              val={allTrackOptions[goToCircuit]}
            />
          </Grid>
          <Grid item xs={3}>
            <DriverAutoComplete
              modifiedDrivers={modifiedDrivers ?? []}
              selectedDriver={selectedDriver}
              setSelectedDriver={setSelectedDriver}
            />
          </Grid>
          <Grid item xs={12}>
            <ResultSection
              eventValue={eventValue}
              allCircuits={allCircuits}
              goToCircuit={goToCircuit}
              selectedSeason={selectedSeason}
              selectedRaceData={selectedRaceData}
              theme={theme}
              selectedDriver={selectedDriver}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MainPage;
