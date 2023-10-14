import { Driver } from "./driver";

export interface ApiDriverStandingResponse {
  driverStandings: DriverStanding[];
}

export interface DriverStanding {
  _id: string;
  driverStandingsId: number;
  raceId: number;
  driverId: number;
  points: number;
  position: number;
  positionText: string;
  wins: number;
  driver: Driver;
}
