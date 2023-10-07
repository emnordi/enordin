import { ApiDriverResponse } from "../types/driver";
import { API_URL } from "./constants";

export async function getDriversFromApi(): Promise<ApiDriverResponse> {
  const response = await fetch(API_URL + "drivers");
  return response.json();
}
