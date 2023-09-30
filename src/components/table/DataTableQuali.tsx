import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Theme,
} from "@mui/material";
import { Result } from "../../types/F1Data";

interface Props {
  selectedRaceData: Result[];
  notFound: string;
  theme: Theme;
}

const DataTableQuali = ({ selectedRaceData, notFound, theme }: Props) => {
  const showData: boolean =
    selectedRaceData != null && selectedRaceData?.length > 0;

  return (
    <TableContainer component={Paper}>
      {showData && (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ th: { fontWeight: "bold", fontSize: "1em" } }}>
              <TableCell align="right">Position</TableCell>
              <TableCell align="right">Driver</TableCell>
              <TableCell align="right">Q1 Time</TableCell>
              <TableCell align="right">Q2 Time</TableCell>
              <TableCell align="right">Q3 Time</TableCell>
              <TableCell align="right">Nationality</TableCell>
              <TableCell align="right">Constructor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
          </TableBody>
        </Table>
      )}
      {!showData && <>{notFound}</>}
    </TableContainer>
  );
};

export default DataTableQuali;
