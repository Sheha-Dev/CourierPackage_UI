export interface LocationRequest {
  locationId?: number;
  locationName: string;
  districtId: number;
}

export interface Location {
  locationId: number;
  locationName: string;
  districtId: number;
  isActive: boolean;
}

export interface LocationListResponse {
  data: Location[];
  message: string;
}

export interface ApiMessageResponse {
  message: string;
}