export interface ApiSeasonResponse {
  seasons: Season[];
}

export interface Season {
  _id: string;
  year: number;
  url: string;
}
