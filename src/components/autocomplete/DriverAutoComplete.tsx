import { useEffect, useState } from "react";
import { Driver } from "../../types/driver";
import F1AutoComplete, {
  AutoCompleteOptions,
  driversEmptyOption,
} from "./F1AutoComplete";

interface Props {
  modifiedDrivers: Driver[];
  selectedDriver: AutoCompleteOptions;
  setSelectedDriver: React.Dispatch<React.SetStateAction<AutoCompleteOptions>>;
}

const DriverAutoComplete = ({
  modifiedDrivers,
  selectedDriver,
  setSelectedDriver,
}: Props) => {
  const [allDriverOptions, setAllDriverOptions] = useState<
    AutoCompleteOptions[]
  >([driversEmptyOption]);

  useEffect(() => {
    setAllDriverOptions(
      [driversEmptyOption].concat(
        modifiedDrivers.map((element, index) => ({
          label: `${element.forename} ${element.surname}`,
          id: element.driverRef,
        }))
      )
    );
  }, [modifiedDrivers]);

  const handleSelectChangeDriver = (driverId: string) => {
    setSelectedDriver(
      allDriverOptions.find((element) => element.id === driverId) ??
        driversEmptyOption
    );
  };

  return (
    <F1AutoComplete
      allOptions={allDriverOptions}
      handleSelectChange={handleSelectChangeDriver}
      val={selectedDriver}
      label="Driver"
    />
  );
};

export default DriverAutoComplete;
