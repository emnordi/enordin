import { useEffect } from "react";
import { Circuit } from "../../types/circuit";
import { Driver } from "../../types/driver";

interface Props {
  circuits: Circuit[];
  circuitsForYear: Circuit[];
  setCircuitsInOrder: () => void;
  drivers: Driver[];
  modifiedDrivers: Driver[];
  setModifiedDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const useInitialStates = ({
  circuits,
  circuitsForYear,
  setCircuitsInOrder,
  drivers,
  modifiedDrivers,
  setModifiedDrivers,
}: Props) => {
  useEffect(() => {
    if (circuitsForYear?.length === 0) {
      setCircuitsInOrder();
    }
  }, [circuits]);

  useEffect(() => {
    modifiedDrivers?.length === 0 && setModifiedDrivers(drivers);
  }, [drivers]);
};

export default useInitialStates;
