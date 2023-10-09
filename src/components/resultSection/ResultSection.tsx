import { Theme } from "@mui/material";
import { RaceTable, Result } from "../../types/F1Data";
import { AutoCompleteOptions } from "../autocomplete/F1AutoComplete";
import DataTable from "../table/DataTable";
import { getResultFromObjectBasedOnEventType } from "./resultSectionUtils";
import { useEffect, useState } from "react";

interface Props {
  eventValue: string;
  selectedSeason: AutoCompleteOptions;
  selectedRaceData: RaceTable;
  theme: Theme;
  selectedDriver: AutoCompleteOptions;
  selectedCircuit: AutoCompleteOptions;
}
const ResultSection = ({
  eventValue,
  selectedSeason,
  selectedRaceData,
  theme,
  selectedDriver,
  selectedCircuit,
}: Props) => {
  const [raceDataResults, setRaceDataResults] = useState<Result[]>(
    getResultFromObjectBasedOnEventType(selectedRaceData, eventValue)
  );

  const notFound =
    eventValue === "Qualifying"
      ? `No qualifying available for ${selectedCircuit?.label} in ${selectedSeason.id} or selected driver`
      : `No results available for ${selectedCircuit?.label} in ${selectedSeason.id} or selected driver`;

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
