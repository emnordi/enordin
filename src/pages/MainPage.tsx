import { useEffect, useState } from "react";
import { Box, Grid, Tab, Tabs, Theme } from "@mui/material";
import MapCarousel from "../components/carousel/Carousel";
import { getF1DataFromApi } from "../service/f1Service";
import { RaceTable, Result, Root } from "../types/F1Data";
import Circuits from "../components/F1Data/Circuits";
import Drivers from "../components/F1Data/Drivers";
import { CircuitFE } from "../types/CircruitFE";
import DataTable from "../components/table/DataTable";
import F1AutoComplete, {
  AutoCompleteOptions,
} from "../components/autocomplete/F1AutoComplete";
import { yearCircuitMap } from "../components/F1Data/YearCircuitMap";
import DataTableQuali from "../components/table/DataTableQuali";

interface Props {
  theme: Theme;
}

const MainPage = ({ theme }: Props) => {
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
  const allDrivers = Drivers().sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );
  const [modifiedDrivers, setModifiedDrivers] = useState(allDrivers);
  const [eventValue, setEventValue] = useState("results");

  const years = Array.from(Array(2023 - 1950 + 1).keys()).map(
    (element) => 2023 - element
  );

  // Fetch F1 data from the API
  const getF1Data = async (circuitId: string) => {
    const data: RaceTable = formatData(
      await getF1DataFromApi(year, circuitId, eventValue)
    );
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

  const handleChangeEvent = (choice: string) => {
    setEventValue(choice);
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
  }, [goToSlide, eventValue]);

  useEffect(() => {
    setSelectedDriver("");
  }, [eventValue]);

  const getResultFromObjectBasedOnEventType = (
    raceData: RaceTable
  ): Result[] => {
    let results: Result[] = [];
    switch (eventValue) {
      case "qualifying": {
        results = raceData?.Races[0]?.QualifyingResults ?? [];
        break;
      }
      case "sprint": {
        results = raceData?.Races[0]?.SprintResults ?? [];
        break;
      }
      default: {
        results = raceData?.Races[0]?.Results ?? [];
        break;
      }
    }

    return results;
  };

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

  // Options for driver selection
  const allDriverOptions: AutoCompleteOptions[] = [
    { label: "Chose a driver to see only their results", id: "" },
  ].concat(
    modifiedDrivers.map((element, index) => ({
      label: `${element.firstName} ${element.lastName}`,
      id: element.driverId,
    }))
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

  const allEventOptions: AutoCompleteOptions[] = [
    { label: "Race", id: "results" },
    { label: "Sprint", id: "sprint" },
    { label: "Qualifying", id: "qualifying" },
  ];

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
          height={"250px"}
          width={"50%"}
          margin={"0 auto"}
          offset={4}
          goToSlide={goToSlide}
          setGoToSlide={setGoToSlide}
          allCircuits={allCircuitsForYear}
        />
      </Box>

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ marginTop: "100px" }}
      >
        <Grid item xs={3}>
          <F1AutoComplete
            allOptions={allEventOptions}
            handleSelectChange={handleChangeEvent}
            label="Event Type"
            useDefault={true}
            val={allEventOptions?.find((element) => element.id === eventValue)}
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
            val={allTrackOptions[goToSlide]}
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
              notFound={`No qualifying available for ${allCircuits[goToSlide]?.name} in ${year} or selected driver`}
              theme={theme}
            />
          )}
          {eventValue !== "qualifying" && (
            <DataTable
              selectedRaceData={selectedRaceResults}
              notFound={`No results available for ${allCircuits[goToSlide]?.name} in ${year} or selected driver`}
              theme={theme}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MainPage;
