import { useState } from "react";
import { RaceTable, Result, Root } from "../types/F1Data";
import Circuits from "../components/F1Data/Circuits";
import { CircuitFE } from "../types/CircruitFE";
import { getF1DataFromApi } from "../service/f1Service";
import {
  AutoCompleteOptions,
  driversEmptyOption,
} from "../components/autocomplete/F1AutoComplete";
import { seasonDefaultOption } from "../components/autocomplete/SeasonAutoComplete";

const useStateHelper = () => {
  const [goToCircuit, setGoToCircuit] = useState(0);
  const [selectedDriver, setSelectedDriver] =
    useState<AutoCompleteOptions>(driversEmptyOption);
  const [selectedRaceData, setSelectedRaceData] = useState<RaceTable>({
    season: "",
    circuitId: "",
    Races: [],
  });
  const [selectedSeason, setSelectedSeason] =
    useState<AutoCompleteOptions>(seasonDefaultOption);
  const allCircuits: CircuitFE[] = Circuits();
  const [allCircuitsForYear, setAllCircuitsForYear] = useState(allCircuits);
  const [eventValue, setEventValue] = useState("results");

  const allEventOptions: AutoCompleteOptions[] = [
    { label: "Race", id: "results" },
    { label: "Sprint", id: "sprint" },
    { label: "Qualifying", id: "qualifying" },
  ];

  const [eventOptions, setEventOptions] = useState(allEventOptions);

  // Fetch F1 data from the API
  const getF1Data = async (circuitId: string) => {
    const data: RaceTable = formatData(
      await getF1DataFromApi(selectedSeason?.id, circuitId, eventValue)
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

  const handleChangeEvent = (choice: string) => {
    setEventValue(choice ?? "results");
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

  return {
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
  };
};

export default useStateHelper;
