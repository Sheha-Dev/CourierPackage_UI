export interface District {
  districtId: number;
  districtName: string;
}

export interface DistrictListResponse {
  data: District[];
  message: string;
}