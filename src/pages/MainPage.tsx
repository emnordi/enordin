import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import { getF1DataFromApi } from "../service/f1Service";
import { RaceTable, Root } from "../types/F1Data";
import Circuits from "../components/F1Data/Circuits";
import Drivers from "../components/F1Data/Drivers";
import { CircuitFE } from "../types/CircruitFE";
import DataTable from "../components/table/DataTable";
import F1AutoComplete, {
  AutoCompleteOptions,
} from "../components/autocomplete/F1AutoComplete";
import { yearCircuitMap } from "../components/F1Data/YearCircuitMap";

const MainPage = () => {
  // State variables
  const [goToSlide, setGoToSlide] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [selectedRaceData, setSelectedRaceData] = useState<RaceTable>({
    season: "",
    circuitId: "",
    Races: [],
  });
  const [modifiedRaceData, setModifiedRaceData] =
    useState<RaceTable>(selectedRaceData);
  const [year, setYear] = useState(2023);

  // Data from external sources
  const allCircuits: CircuitFE[] = Circuits();
  const [allCircuitsForYear, setAllCircuitsForYear] = useState(allCircuits);
  const allDrivers = Drivers();
  const [modifiedDrivers, setModifiedDrivers] = useState(allDrivers);

  const years = Array.from(Array(2023 - 1950 + 1).keys()).map(
    (element) => 2023 - element
  );

  // Fetch F1 data from the API
  const getF1Data = async (circuitId: string) => {
    const data: RaceTable = formatData(await getF1DataFromApi(year, circuitId));
    setSelectedRaceData(data);
  };

  // Event handlers
  const handleSelectChangeCircuit = (circuitId: string) => {
    const selected = allCircuitsForYear.find(
      (element) => element?.circuitId === circuitId
    );
    const indexOfCircuit = selected ? allCircuitsForYear.indexOf(selected) : 0;
    setGoToSlide(indexOfCircuit);
  };

  const handleSelectChangeDriver = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const handleChangeYear = (newYear: string) => {
    setYear(Number(newYear));
  };

  // Format F1 data
  const formatData = (data: Root): RaceTable => {
    return data?.MRData?.RaceTable;
  };

  // Effects
  useEffect(() => {
    const filteredCircuits = allCircuits.filter((circuit) =>
      yearCircuitMap.get(year.toString())?.includes(circuit?.circuitId)
    );
    setAllCircuitsForYear(filteredCircuits);
    getF1Data(filteredCircuits[0]?.circuitId);
  }, [year]);

  useEffect(() => {
    getF1Data(allCircuitsForYear[goToSlide]?.circuitId);
  }, [goToSlide]);

  useEffect(() => {
    setModifiedRaceData(selectedRaceData);
    const driverIdsInSelectedRace: string[] =
      selectedRaceData?.Races[0]?.Results?.map((row) => row?.Driver?.driverId);
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
    const filteredResults = selectedRaceData?.Races[0]?.Results.filter(
      (row) => row.Driver.driverId === selectedDriver
    );

    const { Results, ...rest } = Races[0];
    setModifiedRaceData({
      season,
      circuitId,
      Races: [{ Results: filteredResults, ...rest }],
    });
  }, [selectedDriver]);

  // Data display
  const showData: boolean =
    modifiedRaceData != null && modifiedRaceData?.Races?.length > 0;

  // Options for driver selection
  const allDriverOptions: AutoCompleteOptions[] = modifiedDrivers.map(
    (element, index) => ({
      label: `${element.firstName} ${element.lastName}`,
      id: element.driverId,
    })
  );

  // Options for track selection
  const allTrackOptions: AutoCompleteOptions[] = allCircuitsForYear.map(
    (element, index) => ({
      label: element.name,
      id: element.circuitId,
    })
  );

  // Options for year selection
  const allYearOptions: AutoCompleteOptions[] = years.map((element, index) => ({
    label: element.toString(),
    id: element.toString(),
  }));

  return (
    <>
      <Box sx={{ marginTop: "200px" }}>
        <MapCarousel
          height={"400px"}
          width={"50%"}
          margin={"0 auto"}
          offset={2}
          goToSlide={goToSlide}
          setGoToSlide={setGoToSlide}
          allCircuits={allCircuitsForYear}
        />
      </Box>

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ marginTop: "200px" }}
      >
        <Grid item xs={4}>
          <F1AutoComplete
            allOptions={allYearOptions}
            handleSelectChange={handleChangeYear}
            label="Years"
            useDefault={true}
            val={allYearOptions?.find(
              (element) => element.id === year.toString()
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <F1AutoComplete
            allOptions={allTrackOptions}
            handleSelectChange={handleSelectChangeCircuit}
            label="Tracks"
            useDefault={true}
            val={allTrackOptions[goToSlide]}
          />
        </Grid>
        <Grid item xs={4}>
          <F1AutoComplete
            allOptions={allDriverOptions}
            handleSelectChange={handleSelectChangeDriver}
            label="Driver"
          />
        </Grid>
        <Grid item xs={12}>
          {showData ? (
            <DataTable selectedRaceData={modifiedRaceData} />
          ) : (
            <>{`No results available for ${allCircuits[goToSlide]?.name} in ${year} or selected driver`}</>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MainPage;
