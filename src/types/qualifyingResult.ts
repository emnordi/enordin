import { Constructor } from "./constructor";
import { Driver } from "./driver";

export interface ApiQualifyingResultResponse {
  qualifyingResults: QualifyingResult[];
}

export interface QualifyingResult {
  qualifyId: number;
  raceId: number;
  driverId: number;
  constructorId: number;
  number: number;
  position: string;
  q1: string;
  q2: string;
  q3: string;
  driver: Driver;
  team: Constructor;
  _id: string;
}
