import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { ApiMessageResponse, RoleListResponse } from '../models/role';



@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly apiUrl =
    `${environment.apiBaseUrl}/Role`;

  constructor(
    private http: HttpClient
  ) {}

  getAllRoles(): Observable<RoleListResponse> {
    return this.http.get<RoleListResponse>(
      `${this.apiUrl}/GetAllRoles`
    );
  }

  createRole(
    roleName: string
  ): Observable<ApiMessageResponse> {

    const params = new HttpParams()
      .set('roleName', roleName);

    return this.http.post<ApiMessageResponse>(
      `${this.apiUrl}/CreateRole`,
      null,
      {
        params
      }
    );
  }
}