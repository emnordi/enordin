import { TableRow, TableCell, Theme } from "@mui/material";
import { RaceResult } from "../../types/raceResult";

interface Props {
  selectedRaceResults: RaceResult[];
  theme: Theme;
  getArrow: (position: number) => JSX.Element;
}
//"#CBC3E3"
export const RaceRows = ({ selectedRaceResults, theme, getArrow }: Props) => {
  return (
    <>
      {selectedRaceResults.map((row) => (
        <TableRow
          key={row.resultId}
          sx={{
            "&:last-child td, &:last-child th": { border: 0 },
            "&:nth-of-type(odd)": {
              backgroundColor: theme.palette.mode == "dark" ? theme.palette.action.hover : theme.palette.action.hover,
            },
            "&:nth-of-type(even)": {
              backgroundColor: theme.palette.mode == "light" ? "#CBC3E3" : "",
            },
          }}
        >
          <TableCell align="left" sx={{ paddingLeft: "3%" }}>
            {row?.position}
          </TableCell>
          <TableCell align="left">{row?.driver?.forename + " " + row?.driver?.surname}</TableCell>
          <TableCell align="left" sx={{ paddingLeft: "5%" }}>
            {row?.grid}
          </TableCell>
          <TableCell align="left" sx={{ paddingLeft: "5%" }}>
            {+row?.grid - +row?.position}
            {getArrow(+row?.grid - +row?.position)}
          </TableCell>
          <TableCell align="left">{row.fastestLapTime !== "\\N" ? row.fastestLapTime : null}</TableCell>
          <TableCell align="left">{row?.driver?.nationality}</TableCell>
          <TableCell align="left">{row?.team?.name}</TableCell>
        </TableRow>
      ))}
    </>
  );
};
