import { Theme } from "@mui/material";
import { AutoCompleteOptions } from "../autocomplete/F1AutoComplete";
import DataTable from "../table/DataTable";
import { useEffect, useState } from "react";
import { Race } from "../../types/race";
import { RaceResult } from "../../types/raceResult";
import { QualifyingResult } from "../../types/qualifyingResult";

interface Props {
  eventValue: string;
  selectedSeason: AutoCompleteOptions;
  selectedRaceResults: RaceResult[];
  qualifyingResults: QualifyingResult[];
  theme: Theme;
  selectedDriver: AutoCompleteOptions;
  selectedRace: Race;
}
const ResultSection = ({
  eventValue,
  selectedSeason,
  selectedRaceResults,
  qualifyingResults,
  theme,
  selectedDriver,
  selectedRace,
}: Props) => {
  const [raceDataResults, setRaceDataResults] =
    useState<RaceResult[]>(selectedRaceResults);

  const notFound =
    eventValue === "Qualifying"
      ? `No qualifying available for ${selectedRace.name} in ${selectedSeason.id} or selected driver`
      : `No results available for ${selectedRace.name} in ${selectedSeason.id} or selected driver`;

  useEffect(() => {
    setRaceDataResults(selectedRaceResults);
  }, [selectedRaceResults]);

  useEffect(() => {
    if (selectedDriver.id == "") {
      setRaceDataResults(selectedRaceResults);
      return;
    }

    const filteredResults = raceDataResults.filter(
      (row) => row.driver.driverRef === selectedDriver.id
    );

    setRaceDataResults(filteredResults);
  }, [selectedDriver]);

  return (
    <DataTable
      selectedRaceResults={selectedRaceResults}
      qualifyingResults={qualifyingResults}
      notFound={notFound}
      theme={theme}
      eventValue={eventValue}
    />
  );
};

export default ResultSection;
