import { ApiRaceResultResponse } from "../types/raceResult";
import { API_URL } from "./constants";

export async function getResultsForRaceId(
  raceId: string
): Promise<ApiRaceResultResponse> {
  const response = await fetch(API_URL + "race-results/" + raceId);
  return response.json();
}
