import { useState } from "react";
import { RaceTable, Result, Root } from "../types/F1Data";
import { getF1DataFromApi } from "../service/f1Service";
import {
  AutoCompleteOptions,
  driversEmptyOption,
} from "../components/autocomplete/F1AutoComplete";
import { seasonDefaultOption } from "../components/autocomplete/SeasonAutoComplete";
import { circuitDefaultOption } from "../components/autocomplete/CircuitAutoComplete";

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

  const handleChangeEvent = (choice: string) => {
    setEventValue(choice ?? "results");
  };

  // Format F1 data
  const formatData = (data: Root): RaceTable => {
    return data?.MRData?.RaceTable;
  };

  return {
    goToCircuit,
    setGoToCircuit,
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
  };
};

export default useStateHelper;
