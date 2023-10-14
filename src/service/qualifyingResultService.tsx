import { ApiQualifyingResultResponse } from "../types/qualifyingResult";
import { API_URL } from "./constants";

export async function getQualiResultsForRaceId(
  raceId: number
): Promise<ApiQualifyingResultResponse> {
  const response = await fetch(API_URL + "qualifying-results/" + raceId);
  return response.json();
}
