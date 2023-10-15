import { ApiRaceResultResponse } from "../types/raceResult";
import { ApiWorldChampionResponse } from "../types/worldChampions";
import { API_URL } from "./constants";

export async function getRaceStats(driverId: string): Promise<ApiRaceResultResponse> {
  const response = await fetch(API_URL + "race-result-stats/" + driverId);
  return response.json();
}

export async function getChampions(driverId: string): Promise<ApiWorldChampionResponse> {
  const response = await fetch(API_URL + "world-champions/" + driverId);
  return response.json();
}
