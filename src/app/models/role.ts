export interface RoleModel {
  id: string;
  name: string;
  normalizedName?: string;
  concurrencyStamp?: string;
}

export interface RoleListResponse {
  data: RoleModel[];
}

export interface ApiMessageResponse {
  message: string;
}