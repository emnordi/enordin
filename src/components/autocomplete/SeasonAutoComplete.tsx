import { Season } from "../../types/season";
import F1AutoComplete, { AutoCompleteOptions } from "./F1AutoComplete";

export const seasonDefaultOption: AutoCompleteOptions = {
  label: "2023",
  id: "2023",
};

export const statsPageDefaultOption: AutoCompleteOptions = {
  label: "Whole career",
  id: "",
};

interface Props {
  seasons: Season[];
  selectedSeason: AutoCompleteOptions;
  setSelectedSeason: React.Dispatch<React.SetStateAction<AutoCompleteOptions>>;
  statsPage?: boolean;
}

const SeasonAutoComplete = ({ seasons, selectedSeason, setSelectedSeason, statsPage }: Props) => {
  // Options for year selection
  const allYearOptions: AutoCompleteOptions[] = seasons.map((element, index) => ({
    label: element.year.toString(),
    id: element.year.toString(),
  }));

  statsPage && allYearOptions.unshift(statsPageDefaultOption);

  const defaultOption = statsPage ? statsPageDefaultOption : seasonDefaultOption;

  const handleChangeYear = (newYear: string) => {
    setSelectedSeason(allYearOptions.find((element) => element.id === newYear) ?? defaultOption);
  };

  return (
    <F1AutoComplete
      allOptions={allYearOptions}
      handleSelectChange={handleChangeYear}
      val={selectedSeason}
      label="Season"
    />
  );
};

export default SeasonAutoComplete;
