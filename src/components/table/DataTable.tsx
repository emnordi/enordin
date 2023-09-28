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
              <TableCell align="left">Position</TableCell>
              <TableCell align="left">Driver</TableCell>
              <TableCell align="left">Starting Position</TableCell>
              <TableCell align="left">Positions Gained</TableCell>
              <TableCell align="left">Fastest Lap</TableCell>
              <TableCell align="left">Nationality</TableCell>
              <TableCell align="left">Constructor</TableCell>
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
          </TableBody>
        </Table>
      )}
      {!showData && <>{notFound}</>}
    </TableContainer>
  );
};

export default DataTable;
