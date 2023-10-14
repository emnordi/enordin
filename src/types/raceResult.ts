import { Constructor } from "./constructor";
import { Driver } from "./driver";
import { Race } from "./race";

export interface ApiRaceResultResponse {
  raceResults: RaceResult[];
}

export interface RaceResult {
  resultId: number;
  raceId: number;
  driverId: number;
  constructorId: number;
  number: number;
  grid: number;
  position: string;
  positionText: string;
  positionOrder: number;
  points: number;
  laps: number;
  time: string;
  milliseconds: number;
  fastestLap: number;
  fastestLapTime: string;
  statusId: number;
  race: Race;
  driver: Driver;
  team: Constructor;
  _id: string;
}
