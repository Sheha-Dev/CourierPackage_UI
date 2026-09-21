export interface Location {
  locationId: number;
  latitudeCoordinate: number;
  longitudeCoordinate: number;
  isActive: boolean;
}

export interface LocationRequest {
  locationId: number;
  latitude: number;
  longitude: number;
  isActive: boolean;
}


export interface LocationListResponse {
  data: Location[];
  message: string;
}


export interface ApiMessageResponse {
  message: string;
}