import { ApiRaceResultResponse } from "../types/raceResult";
import { API_URL } from "./constants";

export async function getResultsForRaceId(
  raceId: number,
  isSprint: boolean
): Promise<ApiRaceResultResponse> {
  const event = isSprint ? "sprints/" : "race-results/";
  const response = await fetch(API_URL + event + raceId);
  return response.json();
}
