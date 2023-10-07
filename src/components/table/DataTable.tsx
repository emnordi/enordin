import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Theme,
} from "@mui/material";
import { Result } from "../../types/F1Data";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { QualifyingRows } from "./QualifyingRows";
import { RaceRows } from "./RaceRows";
import { RaceColumns } from "./RaceColumns";
import { QualifyingColumns } from "./QualifyingColumns";

interface Props {
  selectedRaceData: Result[];
  notFound: string;
  theme: Theme;
  eventValue: string;
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

const DataTable = ({
  selectedRaceData,
  notFound,
  theme,
  eventValue,
}: Props) => {
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
              {eventValue === "qualifying" ? (
                <QualifyingColumns />
              ) : (
                <RaceColumns />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {eventValue === "qualifying" ? (
              <QualifyingRows
                selectedRaceData={selectedRaceData}
                theme={theme}
              />
            ) : (
              <RaceRows
                selectedRaceData={selectedRaceData}
                theme={theme}
                getArrow={getArrow}
              />
            )}
          </TableBody>
        </Table>
      )}
      {!showData && <>{notFound}</>}
    </TableContainer>
  );
};

export default DataTable;
