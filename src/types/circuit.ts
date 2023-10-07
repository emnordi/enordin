export interface ApiCircuitResponse {
  circuits: Circuit[];
}

export interface Circuit {
  _id: string;
  circuitId: number;
  circuitRef: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  alt: number;
  url: string;
}
