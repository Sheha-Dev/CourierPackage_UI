import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private readonly apiUrl = `${environment.apiBaseUrl}/District`;

  constructor(
    private http: HttpClient
  ) { }

  getAllDistricts(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/GetAll`
    );
  }
}