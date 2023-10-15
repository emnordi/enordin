export interface ApiWorldChampionResponse {
  worldChampions: WorldChampion[];
}

export interface WorldChampion {
  year: number;
  driverId: number;
  _id: string;
}
