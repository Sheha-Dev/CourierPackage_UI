export interface WarehouseFullRequestDto {
  warehouse: WarehouseRequestDto;
  location: LocationRequestDto;
}

export interface WarehouseRequestDto {
  warehouseId?: number;
  warehouseName: string;
  warehouseLocationId?: number;
  trnUser: string;
  districtId: number;
  provinceId: number;
  streetName: string;
  address: string;
}

export interface LocationRequestDto {
  locationId?: number;
  longitude: number;
  latitude: number;  
  trnUser: string;
}