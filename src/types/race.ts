import { Circuit } from "./circuit";

export interface ApiRaceResponse {
  races: Race[];
}

export interface Race {
  raceId: number;
  year: number;
  round: number;
  circuitId: number;
  name: string;
  date: Date;
  time: string;
  url: string;
  fp1_date: Date;
  fp1_time: string;
  fp2_date: Date;
  fp2_time: string;
  fp3_date: Date;
  fp3_time: string;
  quali_date: Date;
  quali_time: string;
  sprint_date: Date;
  sprint_time: string;
  circuit: Circuit;
  _id: string;
}
