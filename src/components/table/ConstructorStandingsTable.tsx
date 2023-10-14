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
import { ConstructorStanding } from "../../types/constructorStanding";

interface Props {
  standingData: ConstructorStanding[];
  notFound: string;
  theme: Theme;
}

const ConstructorStandingsTable = ({
  standingData,
  notFound,
  theme,
}: Props) => {
  const showData: boolean = standingData != null && standingData?.length > 0;

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
              <TableCell align="left">Points</TableCell>
              <TableCell align="left">Wins</TableCell>
              <TableCell align="left">Constructor</TableCell>
              <TableCell align="left">Nationality</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standingData.map((standingData) => (
              <TableRow
                key={standingData?.position}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell align="left" sx={{ paddingLeft: "2%" }}>
                  {standingData?.position}
                </TableCell>
                <TableCell align="left">{standingData?.points}</TableCell>
                <TableCell align="left">{standingData?.wins}</TableCell>
                <TableCell align="left">{standingData?.team?.name}</TableCell>
                <TableCell align="left">
                  {standingData?.team?.nationality}
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

export default ConstructorStandingsTable;
