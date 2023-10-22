import F1AutoComplete, { AutoCompleteOptions } from "./F1AutoComplete";
import { useEffect, useState } from "react";
import { Race } from "../../types/race";

export const circuitDefaultOption: AutoCompleteOptions = {
  label: "Monaco",
  id: "monaco",
};

export const raceToAutoCompleteOption = (race: Race): AutoCompleteOptions => {
  return { label: race.circuit.name, id: race.raceId.toString() };
};

interface Props {
  racesForSeason: Race[];
  setSelectedRace: React.Dispatch<React.SetStateAction<Race | undefined>>;
  selectedRace: Race | undefined;
}

const CircuitAutoComplete = ({ racesForSeason, setSelectedRace, selectedRace }: Props) => {
  const [allCircuitOptions, setAllCircuitOptions] = useState<AutoCompleteOptions[]>([circuitDefaultOption]);

  useEffect(() => {
    setAllCircuitOptions(racesForSeason.map((element, index) => raceToAutoCompleteOption(element)));
  }, [racesForSeason]);

  const handleSelectChangeCircuit = (raceId: string) => {
    setSelectedRace(racesForSeason.find((element) => element.raceId === +raceId) ?? racesForSeason[0]);
  };

  return (
    <F1AutoComplete
      allOptions={allCircuitOptions}
      handleSelectChange={handleSelectChangeCircuit}
      label="Circuits"
      val={raceToAutoCompleteOption(selectedRace ?? racesForSeason[0])}
    />
  );
};

export default CircuitAutoComplete;
