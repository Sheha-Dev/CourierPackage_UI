import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



import { environment } from '../environments/environment';
import { ApiMessageResponse, LocationRequest } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly apiUrl = `${environment.apiBaseUrl}/Location`;

  constructor(
    private http: HttpClient
  ) { }

  getAllLocations(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/GetAll`
    );
  }

  createLocation(
    request: LocationRequest
  ): Observable<ApiMessageResponse> {

    return this.http.post<ApiMessageResponse>(
      `${this.apiUrl}/Create`,
      request
    );
  }

  updateLocation(
    request: LocationRequest
  ): Observable<ApiMessageResponse> {

    return this.http.put<ApiMessageResponse>(
      `${this.apiUrl}/Update`,
      request
    );
  }

  deactivateLocation(
    locationId: number
  ): Observable<ApiMessageResponse> {

    const params = new HttpParams()
      .set('locationId', locationId);

    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/Deactivate`,
      null,
      { params }
    );
  }
}