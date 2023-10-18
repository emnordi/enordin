import { Autocomplete, TextField } from "@mui/material";

interface Props {
  allOptions: AutoCompleteOptions[];
  handleSelectChange: (value: string) => void;
  label: string;
  val?: AutoCompleteOptions;
  disabled?: boolean;
}

export interface AutoCompleteOptions {
  label: string;
  id: string;
}

const F1AutoComplete = ({ allOptions, handleSelectChange, label, val, disabled }: Props) => {
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
      disabled={disabled}
    />
  );
};

export default F1AutoComplete;
