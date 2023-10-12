import { ApiRaceResponse } from "../types/race";
import { API_URL } from "./constants";

export async function getRacesForSeason(
  season: string
): Promise<ApiRaceResponse> {
  const response = await fetch(API_URL + "races/" + season);
  return response.json();
}
