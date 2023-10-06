import { useState } from "react";
import { RaceTable, Result, Root } from "../types/F1Data";
import Circuits from "../components/F1Data/Circuits";
import { CircuitFE } from "../types/CircruitFE";
import { getF1DataFromApi } from "../service/f1Service";
import {
  AutoCompleteOptions,
  driversEmptyOption,
} from "../components/autocomplete/F1AutoComplete";
import { Driver } from "../types/driver";

const useStateHelper = (drivers: Driver[]) => {
  const [goToCircuit, setGoToCircuit] = useState(0);
  const [selectedDriver, setSelectedDriver] =
    useState<AutoCompleteOptions>(driversEmptyOption);
  const [selectedRaceData, setSelectedRaceData] = useState<RaceTable>({
    season: "",
    circuitId: "",
    Races: [],
  });
  const [modifiedRaceData, setModifiedRaceData] =
    useState<RaceTable>(selectedRaceData);
  const [year, setYear] = useState(2023);
  const allCircuits: CircuitFE[] = Circuits();
  const [allCircuitsForYear, setAllCircuitsForYear] = useState(allCircuits);
  const allDrivers = drivers.sort((a, b) => a.surname.localeCompare(b.surname));
  const [modifiedDrivers, setModifiedDrivers] = useState(allDrivers);
  const [eventValue, setEventValue] = useState("results");

  const allEventOptions: AutoCompleteOptions[] = [
    { label: "Race", id: "results" },
    { label: "Sprint", id: "sprint" },
    { label: "Qualifying", id: "qualifying" },
  ];

  const [eventOptions, setEventOptions] = useState(allEventOptions);

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
    setGoToCircuit(indexOfCircuit);
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

  return {
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
    modifiedDrivers,
    setModifiedDrivers,
    eventValue,
    getF1Data,
    allTrackOptions,
    allYearOptions,
    allEventOptions,
    handleSelectChangeCircuit,
    handleChangeYear,
    handleChangeEvent,
    getResultFromObjectBasedOnEventType,
    eventOptions,
    setEventOptions,
  };
};

export default useStateHelper;
