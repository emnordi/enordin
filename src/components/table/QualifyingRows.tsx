import { TableRow, TableCell, Theme } from "@mui/material";
import { QualifyingResult } from "../../types/qualifyingResult";

interface Props {
  qualifyingResults: QualifyingResult[];
  theme: Theme;
}

export const QualifyingRows = ({ qualifyingResults, theme }: Props) => {
  return (
    <>
      {qualifyingResults.map((row) => (
        <TableRow
          key={row.qualifyId}
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
          <TableCell align="right" sx={{ paddingRight: "3em" }}>
            {row?.position}
          </TableCell>
          <TableCell align="right">{row?.driver?.forename + " " + row?.driver?.surname}</TableCell>
          <TableCell align="right">{row?.q1 !== "\\N" ? row.q1 : null}</TableCell>
          <TableCell align="right">{row?.q2 !== "\\N" ? row.q2 : null}</TableCell>
          <TableCell align="right">{row?.q3 !== "\\N" ? row.q3 : null}</TableCell>
          <TableCell align="right">{row?.driver?.nationality}</TableCell>
          <TableCell align="right">{row?.team?.name}</TableCell>
        </TableRow>
      ))}
    </>
  );
};
