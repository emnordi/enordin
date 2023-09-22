import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { RaceTable } from "../../types/F1Data";

interface Props {
  selectedRaceData: RaceTable;
}

const DataTable = ({ selectedRaceData }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Position</TableCell>
            <TableCell align="right">Driver</TableCell>
            <TableCell align="right">Starting Position</TableCell>
            <TableCell align="right">Positions Gained</TableCell>
            <TableCell align="right">Fastest Lap</TableCell>
            <TableCell align="right">Nationality</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedRaceData?.Races[0]?.Results.map((row) => (
            <TableRow
              key={row?.position}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{row?.position}</TableCell>
              <TableCell align="right">
                {row?.Driver?.givenName + " " + row?.Driver?.familyName}
              </TableCell>
              <TableCell align="right">{row?.grid}</TableCell>
              <TableCell align="right">{+row?.grid - +row?.position}</TableCell>
              <TableCell align="right">{row.FastestLap?.Time?.time}</TableCell>
              <TableCell align="right">{row?.Driver?.nationality}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
