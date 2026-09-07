import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WarehouseFullRequestDto } from '../models/warehouse';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private readonly baseUrl = `${environment.apiBaseUrl}/Warehouse`;

  constructor(private http: HttpClient) {}

  getAllWarehouses(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/GetAll`
    );
  }

  createWarehouse(
    request: WarehouseFullRequestDto
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Create`,
      request
    );
  }

  updateWarehouse(
    request: WarehouseFullRequestDto
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/Update`,
      request
    );
  }

  deactivateWarehouse(
    warehouseId: number
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/Deactivate?warehouseId=${warehouseId}`,
      {}
    );
  }
}