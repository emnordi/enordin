import { ApiDriverStandingResponse } from "../types/driverStanding";
import { API_URL } from "./constants";

export async function getDriverStandingsFromApi(
  raceId: number,
  signal?: AbortSignal
): Promise<ApiDriverStandingResponse> {
  const response = await fetch(API_URL + "driver-standings/" + raceId, {
    signal,
  });
  return response.json();
}
