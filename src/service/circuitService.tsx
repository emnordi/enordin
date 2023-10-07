import { ApiCircuitResponse } from "../types/circuit";
import { API_URL } from "./constants";

export async function getCircuitsFromApi(): Promise<ApiCircuitResponse> {
  const response = await fetch(API_URL + "circuits");
  return response.json();
}
