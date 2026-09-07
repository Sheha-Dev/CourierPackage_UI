export interface Province {
  provinceId: number;
  provinceName: string;
}

export interface ProvinceListResponse {
  data: Province[];
  message: string;
}