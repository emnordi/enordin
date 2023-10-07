import { TableRow, TableCell, Theme } from "@mui/material";
import { Result } from "../../types/F1Data";

interface Props {
  selectedRaceData: Result[];
  theme: Theme;
  getArrow: (position: number) => JSX.Element;
}

export const RaceRows = ({ selectedRaceData, theme, getArrow }: Props) => {
  return (
    <>
      {selectedRaceData.map((row) => (
        <TableRow
          key={row?.position}
          sx={{
            "&:last-child td, &:last-child th": { border: 0 },
            "&:nth-of-type(odd)": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <TableCell align="left" sx={{ paddingLeft: "3%" }}>
            {row?.position}
          </TableCell>
          <TableCell align="left">
            {row?.Driver?.givenName + " " + row?.Driver?.familyName}
          </TableCell>
          <TableCell align="left" sx={{ paddingLeft: "5%" }}>
            {row?.grid}
          </TableCell>
          <TableCell align="left" sx={{ paddingLeft: "5%" }}>
            {+row?.grid - +row?.position}
            {getArrow(+row?.grid - +row?.position)}
          </TableCell>
          <TableCell align="left">{row.FastestLap?.Time?.time}</TableCell>
          <TableCell align="left">{row?.Driver?.nationality}</TableCell>
          <TableCell align="left">{row?.Constructor?.name}</TableCell>
        </TableRow>
      ))}
    </>
  );
};
