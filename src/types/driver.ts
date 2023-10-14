export interface ApiDriverResponse {
  drivers: Driver[];
}

export interface Driver {
  _id: string;
  driverId: number;
  driverRef: string;
  number?: string;
  code: string;
  forename: string;
  surname: string;
  dob: string;
  nationality: string;
  url: string;
}
