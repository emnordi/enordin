import { Constructor } from "./constructor";

export interface ApiConstructorStandingResponse {
  constructorStandings: ConstructorStanding[];
}

export interface ConstructorStanding {
  _id: string;
  constructorStandingsId: number;
  raceId: number;
  constructorId: number;
  points: number;
  position: number;
  positionText: string;
  wins: number;
  team: Constructor;
}
