import { ApiSeasonResponse } from "../types/season";
import { API_URL } from "./constants";

export async function getSeasonsFromApi(): Promise<ApiSeasonResponse> {
  const response = await fetch(API_URL + "seasons");
  return response.json();
}
