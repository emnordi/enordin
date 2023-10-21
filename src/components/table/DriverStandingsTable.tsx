import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Theme } from "@mui/material";
import { DriverStanding } from "../../types/driverStanding";

interface Props {
  standingData: DriverStanding[];
  driverConstructorMap: Map<number, string[]>;
  notFound: string;
  theme: Theme;
}

const DriverStandingsTable = ({ standingData, driverConstructorMap, notFound, theme }: Props) => {
  const showData: boolean = standingData != null && standingData?.length > 0;

  return (
    <TableContainer component={Paper}>
      {showData && (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{
                th: { fontSize: "0.9em", fontFamily: "Formula1Regular" },
              }}
            >
              <TableCell align="left">Position</TableCell>
              <TableCell align="left">Points</TableCell>
              <TableCell align="left">Driver</TableCell>
              <TableCell align="left">Nationality</TableCell>
              <TableCell align="left">Wins</TableCell>
              <TableCell align="left">Constructor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standingData.map((standingData) => (
              <TableRow
                key={standingData?.position}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:nth-of-type(odd)": {
                    backgroundColor:
                      theme.palette.mode == "dark" ? theme.palette.action.hover : theme.palette.action.hover,
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: theme.palette.mode == "light" ? "#CBC3E3" : "",
                  },
                }}
              >
                <TableCell align="left" sx={{ paddingLeft: "2%" }}>
                  {standingData?.position}
                </TableCell>
                <TableCell align="left">{standingData?.points}</TableCell>
                <TableCell align="left">
                  {standingData?.driver?.forename + " " + standingData?.driver?.surname}
                </TableCell>
                <TableCell align="left">{standingData?.driver?.nationality}</TableCell>
                <TableCell align="left">{standingData?.wins}</TableCell>
                <TableCell align="left">
                  {driverConstructorMap.get(standingData?.driver?.driverId)?.toString() ?? "No constructor"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {!showData && <>{notFound}</>}
    </TableContainer>
  );
};

export default DriverStandingsTable;
