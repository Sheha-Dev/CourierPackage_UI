export interface BoxDimensionRequest {
  boxDimensionId: number;
  height: number;
  width: number;
  length: number;
}

export interface PackageRequest {
  packageId: number;
  packageTrackingId: number;

  boxTypeId: number;

  boxDimensionRequestDto: BoxDimensionRequest;

  senderId: string;
  recipientId: number;

  estimatedWeight: number;

  isVerified: boolean;

  statusId: number;

  handOverWarehouseId: number;
  destinationId: number;

  estimatedAmount: number;

  receivedDate: string;
  expectedDeliverDate: string;

  trnUser: string;
}

export interface BoxType {
  boxTypeId: number;
  boxTypeName: string;
}

export interface PackageApiResponse {
  data: any;
  message: string;
}

export interface PackageCreateResponse {
  packageId: number;
  message: string;
}

export interface ApiMessageResponse {
  message: string;
}