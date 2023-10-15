import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Theme } from "@mui/material";
import { RaceResult } from "../../types/raceResult";
import { Driver } from "../../types/driver";
import { WorldChampion } from "../../types/worldChampions";
import { Race } from "../../types/race";

interface Props {
  raceResults: RaceResult[];
  driver?: Driver;
  championships: WorldChampion[];
  racesForSeason: Race[];
  theme: Theme;
}

const DriverStatsTable = ({ raceResults, driver, championships, racesForSeason, theme }: Props) => {
  let podiums = raceResults.filter((result) => result.position !== "\\N" && +result.position <= 3);
  if (racesForSeason.length > 0) {
    const raceIdsForSeason = racesForSeason.map(({ raceId }) => raceId);
    podiums = podiums.filter(({ raceId }) => raceIdsForSeason.includes(raceId));
  }

  const wins = podiums.filter((result) => +result.position === 1);

  return driver ? (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow
            sx={{
              th: { fontWeight: "bold", fontSize: "1em" },
            }}
          >
            <TableCell align="left">Driver</TableCell>
            <TableCell align="left">Nationality</TableCell>
            <TableCell align="left">Wins</TableCell>
            <TableCell align="left">Podiums</TableCell>
            <TableCell align="left">Titles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            key={driver?.driverId}
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
              "&:nth-of-type(odd)": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <TableCell align="left" sx={{ paddingLeft: "2%" }}>
              {driver?.forename + " " + driver?.surname}
            </TableCell>
            <TableCell align="left">{driver.nationality}</TableCell>
            <TableCell align="left">{wins.length}</TableCell>
            <TableCell align="left">{podiums.length}</TableCell>
            <TableCell align="left">{championships.length}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <></>
  );
};

export default DriverStatsTable;
