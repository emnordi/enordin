import { useEffect, useState } from "react";
import { Box, Grid, Theme } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import F1AutoComplete, {
  AutoCompleteOptions,
  driversEmptyOption,
} from "../components/autocomplete/F1AutoComplete";
import { yearCircuitMap } from "../components/F1Data/YearCircuitMap";
import useStateHelper from "./useStateHelper";
import { yearSprintRaceMap } from "../components/F1Data/SprintRaces";
import { Driver } from "../types/driver";
import DriverAutoComplete from "../components/autocomplete/DriverAutoComplete";
import { Season } from "../types/season";
import SeasonAutoComplete from "../components/autocomplete/SeasonAutoComplete";
import ResultSection from "../components/resultSection/ResultSection";
import { getResultFromObjectBasedOnEventType } from "../components/resultSection/resultSectionUtils";
import { Circuit } from "../types/circuit";
import CircuitAutoComplete, {
  circuitToAutoCompleteOption,
} from "../components/autocomplete/CircuitAutoComplete";

interface Props {
  theme: Theme;
  drivers: Driver[];
  seasons: Season[];
  circuits: Circuit[];
}

const MainPage = ({ theme, drivers, seasons, circuits }: Props) => {
  const {
    selectedDriver,
    setSelectedDriver,
    selectedRaceData,
    selectedSeason,
    setSelectedSeason,
    eventValue,
    getF1Data,
    allEventOptions,
    handleChangeEvent,
    eventOptions,
    setEventOptions,
  } = useStateHelper();

  const [modifiedDrivers, setModifiedDrivers] = useState<Driver[]>(drivers);

  const [circuitsForYear, setCircuitsForYear] = useState<Circuit[]>(circuits);

  const [selectedCircuit, setSelectedCircuit] = useState<
    AutoCompleteOptions | undefined
  >();

  useEffect(() => {
    modifiedDrivers?.length === 0 && setModifiedDrivers(drivers);
  }, [drivers]);

  const setCircuitsInOrder = () => {
    const circuitsOrdered: Circuit[] = [];
    yearCircuitMap.get(selectedSeason.id)?.forEach((value) => {
      const c = circuits.find((circuit) => circuit?.circuitRef === value);
      if (c != null) circuitsOrdered.push(c);
    });
    setCircuitsForYear(circuitsOrdered);
    getF1Data(circuitsOrdered[0]?.circuitRef);
  };

  useEffect(() => {
    if (circuitsForYear?.length === 0) {
      setCircuitsInOrder();
    }
  }, [circuits]);

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
    if (
      selectedCircuit &&
      !yearSprintRaceMap.get(selectedSeason.id)?.includes(selectedCircuit.id)
    ) {
      setEventOptions(eventOptions.filter((option) => option.id !== "sprint"));
      eventValue === "sprint" && handleChangeEvent("results");
    } else {
      setEventOptions(allEventOptions);
    }
    getF1Data(selectedCircuit?.id ?? circuitsForYear[0]?.circuitRef);
  }, [selectedCircuit, eventValue]);

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
                eventValue={eventValue}
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
