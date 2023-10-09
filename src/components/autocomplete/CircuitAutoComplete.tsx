import F1AutoComplete, { AutoCompleteOptions } from "./F1AutoComplete";
import { Circuit } from "../../types/circuit";
import { useEffect, useState } from "react";

export const circuitDefaultOption: AutoCompleteOptions = {
  label: "Monaco",
  id: "monaco",
};

export const circuitToAutoCompleteOption = (
  circuit: Circuit
): AutoCompleteOptions => {
  return { label: circuit?.name, id: circuit?.circuitRef };
};

interface Props {
  circuits: Circuit[];
  selectedCircuit: AutoCompleteOptions;
  setSelectedCircuit: React.Dispatch<
    React.SetStateAction<AutoCompleteOptions | undefined>
  >;
}

const CircuitAutoComplete = ({
  circuits,
  selectedCircuit,
  setSelectedCircuit,
}: Props) => {
  const [allCircuitOptions, setAllCircuitOptions] = useState<
    AutoCompleteOptions[]
  >([circuitDefaultOption]);

  useEffect(() => {
    setAllCircuitOptions(
      circuits.map((element, index) => ({
        label: element.name,
        id: element.circuitRef,
      }))
    );
  }, [circuits]);

  const handleSelectChangeCircuit = (circuitId: string) => {
    const selected = allCircuitOptions.find(
      (element) => element.id === circuitId
    );
    setSelectedCircuit(selected ?? allCircuitOptions[0]);
  };

  return (
    <F1AutoComplete
      allOptions={allCircuitOptions}
      handleSelectChange={handleSelectChangeCircuit}
      label="Circuits"
      val={selectedCircuit}
    />
  );
};

export default CircuitAutoComplete;
