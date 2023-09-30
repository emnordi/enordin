import { Box, Grid, Tab, Tabs, Theme } from "@mui/material";
import React, { useEffect } from "react";
import { getStandings } from "../service/f1Service";
import { StandingsList, StandingsRoot } from "../types/F1Data";
import DriverStandingsTable from "../components/table/DriverStandingsTable";
import ConstructorStandingsTable from "../components/table/ConstructorStandingsTable";
import F1AutoComplete, {
  AutoCompleteOptions,
} from "../components/autocomplete/F1AutoComplete";
import useStateHelper from "./useStateHelper";
import { yearCircuitMap } from "../components/F1Data/YearCircuitMap";
import { set } from "date-fns";

interface Props {
  theme: Theme;
}

const StandingsPage = ({ theme }: Props) => {
  const [value, setValue] = React.useState(0);

  const [numberOfRaces, setNumberOfRaces] = React.useState<number>(0);

  const [round, setRound] = React.useState<number>(0);

  const allRoundOptions: AutoCompleteOptions[] = [
    { label: "Final Results", id: "0" },
  ].concat(
    Array.from(Array(numberOfRaces).keys()).map((element, index) => ({
      label: (1 + element).toString(),
      id: (1 + element).toString(),
    }))
  );

  const handleChangeRound = (newRound: string) => {
    setRound(Number(newRound));
  };

  const { year, allYearOptions, handleChangeYear } = useStateHelper();

  const [standingsData, setStandingsData] = React.useState<StandingsList>();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const formatData = (data: StandingsRoot): StandingsList => {
    return data.MRData.StandingsTable.StandingsLists[0];
  };

  const getStandingsData = async () => {
    const data = await getStandings(year, value === 0, round);
    setStandingsData(formatData(data));
  };

  useEffect(() => {
    getStandingsData();
  }, [value, year, round]);

  useEffect(() => {
    setNumberOfRaces(yearCircuitMap.get(year.toString())?.length ?? 0);
    setRound(0);
  }, [year]);

  return (
    <Box sx={{ width: "80%", margin: "0 auto", paddingTop: "5%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <F1AutoComplete
            allOptions={allYearOptions}
            handleSelectChange={handleChangeYear}
            label="Years"
            useDefault={true}
            val={allYearOptions?.find(
              (element) => element.label === year.toString()
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <F1AutoComplete
            allOptions={allRoundOptions}
            handleSelectChange={handleChangeRound}
            label="Standing after round"
            val={allRoundOptions?.find(
              (element) => element.id === round.toString()
            )}
          />
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          <Tab label="Drivers Standings" />
          <Tab label="Constructors Standings" />
        </Tabs>
      </Box>

      <div hidden={value !== 0}>
        <DriverStandingsTable
          standingData={standingsData?.DriverStandings ?? []}
          notFound="No standings found"
          theme={theme}
        />
      </div>
      <div hidden={value !== 1}>
        <ConstructorStandingsTable
          standingData={standingsData?.ConstructorStandings ?? []}
          notFound="No standings found"
          theme={theme}
        />
      </div>
    </Box>
  );
};

export default StandingsPage;
