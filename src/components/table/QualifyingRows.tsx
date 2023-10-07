import { TableRow, TableCell, Theme } from "@mui/material";
import { Result } from "../../types/F1Data";

interface Props {
  selectedRaceData: Result[];
  theme: Theme;
}

export const QualifyingRows = ({ selectedRaceData, theme }: Props) => {
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
          <TableCell align="right" sx={{ paddingRight: "3em" }}>
            {row?.position}
          </TableCell>
          <TableCell align="right">
            {row?.Driver?.givenName + " " + row?.Driver?.familyName}
          </TableCell>
          <TableCell align="right">{row?.Q1}</TableCell>
          <TableCell align="right">{row?.Q2}</TableCell>
          <TableCell align="right">{row?.Q3}</TableCell>
          <TableCell align="right">{row?.Driver?.nationality}</TableCell>
          <TableCell align="right">{row?.Constructor?.name}</TableCell>
        </TableRow>
      ))}
    </>
  );
};
