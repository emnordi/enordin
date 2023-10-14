import { StandingsRoot } from "../types/F1Data";

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
