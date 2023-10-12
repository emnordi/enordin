import { useEffect } from "react";
import { Circuit } from "../../types/circuit";
import { Driver } from "../../types/driver";

interface Props {
  drivers: Driver[];
  modifiedDrivers: Driver[];
  setModifiedDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const useInitialStates = ({
  drivers,
  modifiedDrivers,
  setModifiedDrivers,
}: Props) => {
  useEffect(() => {
    modifiedDrivers?.length === 0 && setModifiedDrivers(drivers);
  }, [drivers]);
};

export default useInitialStates;
