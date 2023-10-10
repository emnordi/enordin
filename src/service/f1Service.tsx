import { AutoCompleteOptions } from "../components/autocomplete/F1AutoComplete";
import { RaceTable, Root, StandingsRoot } from "../types/F1Data";

//https://ergast.com/api/f1/<season>/<round>/...
// "https://ergast.com/api/f1/" + season + "/results.json"

export async function getF1DataFromApi(
  season: string,
  circuitId: string,
  eventType: string
): Promise<Root> {
  const response = await fetch(
    "https://ergast.com/api/f1/" +
      season +
      "/circuits/" +
      circuitId +
      "/" +
      eventType +
      ".json"
  );
  return response.json();
}

export async function getTrackOrder(season: number): Promise<Root> {
  const response = await fetch("https://ergast.com/api/f1/" + season + ".json");
  return response.json();
}

export async function getStandings(
  season: string,
  driverStandings: boolean,
  round?: number,
  signal?: AbortSignal
): Promise<StandingsRoot> {
  const standingType = driverStandings
    ? "driverStandings"
    : "constructorStandings";
  const roundParam = round ? round + "/" : "";
  const response = await fetch(
    "https://ergast.com/api/f1/" +
      season +
      "/" +
      roundParam +
      standingType +
      ".json",
    { signal }
  );
  return response.json();
}

// Format F1 data
const formatData = (data: Root): RaceTable => {
  return data?.MRData?.RaceTable;
};

// Fetch F1 data from the API
export const getF1Data = async (
  circuitId: string,
  selectedSeason: AutoCompleteOptions,
  selectedEvent: AutoCompleteOptions
) => {
  const data: RaceTable = formatData(
    await getF1DataFromApi(selectedSeason?.id, circuitId, selectedEvent?.id)
  );
  return data;
};
