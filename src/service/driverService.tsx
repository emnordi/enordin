import { ApiDriverResponse, Driver } from "../types/driver";

export async function getDriversFromApi(): Promise<ApiDriverResponse> {
  const response = await fetch("https://enordin-api.vercel.app/api/drivers");
  return response.json();
}
