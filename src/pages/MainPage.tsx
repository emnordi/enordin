import { useEffect } from "react";
import { Box, Grid, Theme } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import DataTable from "../components/table/DataTable";
import F1AutoComplete from "../components/autocomplete/F1AutoComplete";
import { yearCircuitMap } from "../components/F1Data/YearCircuitMap";
import DataTableQuali from "../components/table/DataTableQuali";
import useStateHelper from "./useStateHelper";

interface Props {
  theme: Theme;
}

const MainPage = ({ theme }: Props) => {
  const {
    goToCircuit,
    setGoToCircuit,
    selectedDriver,
    setSelectedDriver,
    selectedRaceData,
    modifiedRaceData,
    setModifiedRaceData,
    year,
    allCircuits,
    allCircuitsForYear,
    setAllCircuitsForYear,
    allDrivers,
    setModifiedDrivers,
    eventValue,
    getF1Data,
    allTrackOptions,
    allYearOptions,
    allEventOptions,
    allDriverOptions,
    handleSelectChangeCircuit,
    handleSelectChangeDriver,
    handleChangeYear,
    handleChangeEvent,
    getResultFromObjectBasedOnEventType,
  } = useStateHelper();

  // Effects
  useEffect(() => {
    const filteredCircuits = allCircuits.filter((circuit) =>
      yearCircuitMap.get(year.toString())?.includes(circuit?.circuitId)
    );
    setAllCircuitsForYear(filteredCircuits);
    getF1Data(filteredCircuits[0]?.circuitId);
  }, [year]);

  useEffect(() => {
    getF1Data(allCircuitsForYear[goToCircuit]?.circuitId);
  }, [goToCircuit, eventValue]);

  useEffect(() => {
    setSelectedDriver("");
  }, [eventValue]);

  useEffect(() => {
    setModifiedRaceData(selectedRaceData);
    const res = getResultFromObjectBasedOnEventType(selectedRaceData);
    const driverIdsInSelectedRace: string[] =
      res.map((row) => row?.Driver?.driverId) ?? [];
    setModifiedDrivers(
      allDrivers.filter((driver) =>
        driverIdsInSelectedRace?.includes(driver.driverId)
      )
    );
  }, [selectedRaceData]);

  useEffect(() => {
    if (selectedDriver == "") {
      setModifiedRaceData(selectedRaceData);
      return;
    }

    const { season, circuitId, Races } = selectedRaceData;

    const filteredResults = getResultFromObjectBasedOnEventType(
      selectedRaceData
    ).filter((row) => row.Driver.driverId === selectedDriver);

    const { Results, SprintResults, QualifyingResults, ...rest } = Races[0];
    setModifiedRaceData({
      season,
      circuitId,
      Races: [
        {
          Results: filteredResults,
          SprintResults: filteredResults,
          QualifyingResults: filteredResults,
          ...rest,
        },
      ],
    });
  }, [selectedDriver]);

  const selectedRaceResults =
    getResultFromObjectBasedOnEventType(modifiedRaceData);

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
              allOptions={allEventOptions}
              handleSelectChange={handleChangeEvent}
              label="Event Type"
              useDefault={true}
              val={allEventOptions?.find(
                (element) => element.id === eventValue
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <F1AutoComplete
              allOptions={allYearOptions}
              handleSelectChange={handleChangeYear}
              label="Years"
              useDefault={true}
              val={allYearOptions?.find(
                (element) => element.label === year.toString()
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <F1AutoComplete
              allOptions={allTrackOptions}
              handleSelectChange={handleSelectChangeCircuit}
              label="Tracks"
              useDefault={true}
              val={allTrackOptions[goToCircuit]}
            />
          </Grid>
          <Grid item xs={3}>
            <F1AutoComplete
              allOptions={allDriverOptions}
              handleSelectChange={handleSelectChangeDriver}
              val={allDriverOptions?.find(
                (element) => element.id === selectedDriver
              )}
              label="Driver"
            />
          </Grid>
          <Grid item xs={12}>
            {eventValue === "qualifying" && (
              <DataTableQuali
                selectedRaceData={selectedRaceResults}
                notFound={`No qualifying available for ${allCircuits[goToCircuit]?.name} in ${year} or selected driver`}
                theme={theme}
              />
            )}
            {eventValue !== "qualifying" && (
              <DataTable
                selectedRaceData={selectedRaceResults}
                notFound={`No results available for ${allCircuits[goToCircuit]?.name} in ${year} or selected driver`}
                theme={theme}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MainPage;
