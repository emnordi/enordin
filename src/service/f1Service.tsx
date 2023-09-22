import { Root } from "../types/F1Data";

//https://ergast.com/api/f1/<season>/<round>/...
// "https://ergast.com/api/f1/" + season + "/results.json"

export async function getF1DataFromApi(
  season: number,
  circuitId: string
): Promise<Root> {
  const response = await fetch(
    "https://ergast.com/api/f1/" +
      season +
      "/circuits/" +
      circuitId +
      "/results.json"
  );
  return response.json();
}

//Use to get trackids
export async function trackIds(season: number, round: number): Promise<Root> {
  const response = await fetch("https://ergast.com/api/f1/" + season + ".json");
  return response.json();
}
