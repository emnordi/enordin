import { Autocomplete, TextField } from "@mui/material";

interface Props {
  allOptions: AutoCompleteOptions[];
  handleSelectChange: (value: string) => void;
  label: string;
  useDefault?: boolean;
}

export interface AutoCompleteOptions {
  label: string;
  id: string;
}

const F1AutoComplete = ({
  allOptions,
  handleSelectChange,
  label,
  useDefault,
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
      defaultValue={useDefault ? allOptions[0] : null}
      options={allOptions}
      onChange={(event, value) => {
        handleSelectChange(value?.id || "");
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

export default F1AutoComplete;
