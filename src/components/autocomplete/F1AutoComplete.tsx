import { Autocomplete, TextField } from "@mui/material";

interface Props {
  allOptions: AutoCompleteOptions[];
  handleSelectChange: (value: string) => void;
  label: string;
  val?: AutoCompleteOptions;
}

export const driversEmptyOption: AutoCompleteOptions = {
  label: "Chose a driver to see only their results",
  id: "",
};

export interface AutoCompleteOptions {
  label: string;
  id: string;
}

const F1AutoComplete = ({
  allOptions,
  handleSelectChange,
  label,
  val,
}: Props) => {
  return (
    <Autocomplete
      disablePortal
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: "flip",
              enabled: false,
            },
            {
              name: "preventOverflow",
              enabled: false,
            },
          ],
        },
      }}
      id="combo-box-demo"
      value={val}
      options={allOptions ?? []}
      onChange={(event, value) => {
        handleSelectChange(value?.id || "");
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

export default F1AutoComplete;
