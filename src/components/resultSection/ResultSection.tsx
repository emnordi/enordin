import { Theme } from "@mui/material";
import { CircuitFE } from "../../types/CircruitFE";
import { RaceTable, Result } from "../../types/F1Data";
import { AutoCompleteOptions } from "../autocomplete/F1AutoComplete";
import DataTable from "../table/DataTable";
import { getResultFromObjectBasedOnEventType } from "./resultSectionUtils";
import { useEffect, useState } from "react";

interface Props {
  eventValue: string;
  allCircuits: CircuitFE[];
  goToCircuit: number;
  selectedSeason: AutoCompleteOptions;
  selectedRaceData: RaceTable;
  theme: Theme;
  selectedDriver: AutoCompleteOptions;
}
const ResultSection = ({
  eventValue,
  allCircuits,
  goToCircuit,
  selectedSeason,
  selectedRaceData,
  theme,
  selectedDriver,
}: Props) => {
  const [raceDataResults, setRaceDataResults] = useState<Result[]>(
    getResultFromObjectBasedOnEventType(selectedRaceData, eventValue)
  );

  const notFound =
    eventValue === "Qualifying"
      ? `No qualifying available for ${allCircuits[goToCircuit]?.name} in ${selectedSeason.id} or selected driver`
      : `No results available for ${allCircuits[goToCircuit]?.name} in ${selectedSeason.id} or selected driver`;

  useEffect(() => {
    setRaceDataResults(
      getResultFromObjectBasedOnEventType(selectedRaceData, eventValue)
    );
  }, [selectedRaceData]);

  useEffect(() => {
    if (selectedDriver.id == "") {
      setRaceDataResults(
        getResultFromObjectBasedOnEventType(selectedRaceData, eventValue)
      );
      return;
    }

    const filteredResults = raceDataResults.filter(
      (row) => row.Driver.driverId === selectedDriver.id
    );

    setRaceDataResults(filteredResults);
  }, [selectedDriver]);

  return (
    <DataTable
      selectedRaceData={raceDataResults}
      notFound={notFound}
      theme={theme}
      eventValue={eventValue}
    />
  );
};

export default ResultSection;
