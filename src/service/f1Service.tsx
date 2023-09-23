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
