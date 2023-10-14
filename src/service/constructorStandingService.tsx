import { ApiConstructorStandingResponse } from "../types/constructorStanding";
import { API_URL } from "./constants";

export async function getConstructorStandingsFromApi(
  raceId: number,
  signal?: AbortSignal
): Promise<ApiConstructorStandingResponse> {
  const response = await fetch(API_URL + "constructor-standings/" + raceId, {
    signal,
  });
  return response.json();
}
