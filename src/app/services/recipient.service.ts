import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { ApiMessageResponse, RecipientListResponse, RecipientRequest } from '../models/recipient';


@Injectable({
  providedIn: 'root'
})
export class RecipientService {

  private readonly apiUrl =
    `${environment.apiBaseUrl}/Recipient`;

  constructor(
    private http: HttpClient
  ) { }


  // =========================================
  // GET ALL RECIPIENTS BY USER
  // =========================================

  getAllRecipientsByUser(
    userId: string
  ): Observable<RecipientListResponse> {

    const params = new HttpParams()
      .set('userId', userId);

    return this.http.get<RecipientListResponse>(
      `${this.apiUrl}/GetAllByUser`,
      { params }
    );
  }


  // =========================================
  // CREATE RECIPIENT
  // =========================================

  createRecipient(
    request: RecipientRequest
  ): Observable<ApiMessageResponse> {

    return this.http.post<ApiMessageResponse>(
      `${this.apiUrl}/Create`,
      request
    );
  }


  // =========================================
  // UPDATE RECIPIENT
  // =========================================

  updateRecipient(
    request: RecipientRequest
  ): Observable<ApiMessageResponse> {

    return this.http.put<ApiMessageResponse>(
      `${this.apiUrl}/Update`,
      request
    );
  }


  // =========================================
  // DEACTIVATE RECIPIENT
  // =========================================

  deactivateRecipient(
    recipientId: number
  ): Observable<ApiMessageResponse> {

    const params = new HttpParams()
      .set('recipientId', recipientId);

    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/Deactivate`,
      null,
      { params }
    );
  }
}