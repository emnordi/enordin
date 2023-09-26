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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface Props {
  selectedRaceData: Result[];
  notFound: string;
  theme: Theme;
}

const getArrow = (position: number) => {
  if (position > 0) {
    return (
      <KeyboardArrowUpIcon sx={{ color: "green", marginBottom: "-5px" }} />
    );
  } else if (position < 0) {
    return (
      <KeyboardArrowDownIcon sx={{ color: "red", marginBottom: "-5px" }} />
    );
  } else {
    return <KeyboardArrowDownIcon sx={{ visibility: "hidden" }} />;
  }
};

const DataTable = ({ selectedRaceData, notFound, theme }: Props) => {
  const showData: boolean =
    selectedRaceData != null && selectedRaceData?.length > 0;

  return (
    <TableContainer component={Paper}>
      {showData && (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{
                th: { fontWeight: "bold", fontSize: "1em" },
              }}
            >
              <TableCell align="right">Position</TableCell>
              <TableCell align="right">Driver</TableCell>
              <TableCell align="right">Starting Position</TableCell>
              <TableCell align="right">Positions Gained</TableCell>
              <TableCell align="right">Fastest Lap</TableCell>
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
                <TableCell align="right" sx={{ paddingRight: "6em" }}>
                  {row?.grid}
                </TableCell>
                <TableCell align="right" sx={{ paddingRight: "4em" }}>
                  {+row?.grid - +row?.position}
                  {getArrow(+row?.grid - +row?.position)}
                </TableCell>
                <TableCell align="right">
                  {row.FastestLap?.Time?.time}
                </TableCell>
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

export default DataTable;
