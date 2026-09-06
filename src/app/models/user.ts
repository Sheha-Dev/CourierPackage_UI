export interface UserRegisterRequest {
  userName: string;
  email: string;
  nickName: string;
  phoneNumber: string;
  password: string;
  roleName: string;
  trnUser: string;
}

export interface UserLoginRequest {
  userName: string;
  passWord: string;
}

export interface UserUpdateRequest {
  userName: string;
  email: string;
  nickName: string;
  phoneNumber: string;
  trnUser: string;
}

export interface ChangePasswordRequest {
  userName: string;
  currentPassword: string;
  newPassword: string;
}

export interface ApiMessageResponse {
  message: string;
}

export interface LoginResponse {
  accessToken: string;
}