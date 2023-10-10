import { useEffect, useState } from "react";
import { Season } from "../../types/season";
import F1AutoComplete, { AutoCompleteOptions } from "./F1AutoComplete";

export const eventDefaultOption: AutoCompleteOptions = {
  label: "Race",
  id: "results",
};

interface Props {
  selectedEvent: AutoCompleteOptions;
  setSelectedEvent: React.Dispatch<React.SetStateAction<AutoCompleteOptions>>;
  sprint: boolean;
}

const EventAutoComplete = ({
  selectedEvent,
  setSelectedEvent,
  sprint,
}: Props) => {
  const allEventOptions: AutoCompleteOptions[] = [
    { label: "Race", id: "results" },
    { label: "Sprint", id: "sprint" },
    { label: "Qualifying", id: "qualifying" },
  ];

  const [eventOptions, setEventOptions] = useState(allEventOptions);

  useEffect(() => {
    if (sprint) {
      setEventOptions(allEventOptions);
    } else {
      setEventOptions([allEventOptions[0], allEventOptions[2]]);
      setSelectedEvent(allEventOptions[0]);
    }
  }, [sprint]);

  const handleChangeEvent = (choice: string) => {
    setSelectedEvent(
      allEventOptions.find((element) => element.id === choice) ??
        eventDefaultOption
    );
  };

  return (
    <F1AutoComplete
      allOptions={eventOptions}
      handleSelectChange={handleChangeEvent}
      label="Event Type"
      val={selectedEvent}
    />
  );
};

export default EventAutoComplete;
