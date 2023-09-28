import { Root } from "../types/F1Data";

//https://ergast.com/api/f1/<season>/<round>/...
// "https://ergast.com/api/f1/" + season + "/results.json"

export async function getF1DataFromApi(
  season: number,
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
