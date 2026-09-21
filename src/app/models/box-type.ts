export interface BoxType {
  boxTypeId: number;
  boxTypeName: string;
}

export interface BoxTypeListResponse {
  data: BoxType[];
  message: string;
}