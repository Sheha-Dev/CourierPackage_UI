export interface RecipientRequest {
  recipientId: number;
  senderId: string;
  userName: string;
  nickName: string;
  contactNumber: string;
  email: string;
  trnUser: string;
}

export interface RecipientResponse {
  recipientId: number;
  senderId: string;
  userName: string;
  nickName: string;
  contactNumber: string;
  email: string;
  isActive: boolean;
}

export interface RecipientListResponse {
  data: RecipientResponse[];
  message: string;
}

export interface ApiMessageResponse {
  message: string;
}