import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiMessageResponse,
  ChangePasswordRequest,
  LoginResponse,
  UserLoginRequest,
  UserRegisterRequest,
  UserUpdateRequest
} from '../models/user';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = `${environment.apiBaseUrl}/User`;

  constructor(
    private http: HttpClient
  ) { }

  register(
    request: UserRegisterRequest
  ): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(
      `${this.apiUrl}/Register`,
      request
    );
  }

  login(
    request: UserLoginRequest
  ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/Login`,
      request
    );
  }

  updateUser(
    request: UserUpdateRequest
  ): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(
      `${this.apiUrl}/Update`,
      request
    );
  }

  activateUser(
    userName: string
  ): Observable<ApiMessageResponse> {

    const params = new HttpParams()
      .set('userName', userName);

    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/Active`,
      null,
      { params }
    );
  }

  deactivateUser(
    userName: string
  ): Observable<ApiMessageResponse> {

    const params = new HttpParams()
      .set('userName', userName);

    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/Deactive`,
      null,
      { params }
    );
  }

  changePassword(
    request: ChangePasswordRequest
  ): Observable<ApiMessageResponse> {
    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/ChangePassword`,
      request
    );
  }

  generateAccessToken(
    userName: string
  ): Observable<LoginResponse> {

    const params = new HttpParams()
      .set('userName', userName);

    return this.http.patch<LoginResponse>(
      `${this.apiUrl}/GenerateAccessToken`,
      null,
      { params }
    );
  }

  // -------------------------
  // Token handling
  // -------------------------

  saveAccessToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  removeAccessToken(): void {
    sessionStorage.removeItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getUserList(): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/GetAllUsers`
    );
  }
}