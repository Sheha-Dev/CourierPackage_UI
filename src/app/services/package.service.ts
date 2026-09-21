import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Location, LocationRequest } from '../models/location';


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

  // Destination selected from map
  destination: LocationRequest;

  estimatedAmount: number;

  receivedDate: string;
  expectedDeliverDate: string;

  trnUser: string;
}


export interface PackageItem {

  packageId: number;
  packageTrackingId: number;
  boxTypeId: number;
  boxHeight : number;
  boxLength : number;
  boxWidth : number;
  boxDimensionId: number;
  senderId: string;
  recipientId: number;
  estimatedWeight: number;
  isVerified: boolean;
  statusId: number;
  handOverWarehouseId: number;
  destinationId: number;
  estimatedAmount: number;
  actualAmount: number;
  receivedDate: string;
  expectedDeliverDate: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  isActive: boolean;
  
}


export interface PackageListResponse {
  data: PackageItem[];
  message: string;
}


export interface PackageResponse {
  data: PackageItem;
  message: string;
}


export interface PackageCreateResponse {
  packageId: number;
  message: string;
}


export interface ApiMessageResponse {
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class PackageService {

  private readonly apiUrl =
    `${environment.apiBaseUrl}/Package`;

  constructor(
    private http: HttpClient
  ) {}


  getAllPackages():
    Observable<PackageListResponse> {

    return this.http.get<PackageListResponse>(
      `${this.apiUrl}/GetAll`
    );
  }


  getPackageById(
    packageId: number
  ): Observable<PackageResponse> {

    const params = new HttpParams()
      .set(
        'packageId',
        packageId.toString()
      );

    return this.http.get<PackageResponse>(
      `${this.apiUrl}/GetById`,
      { params }
    );
  }


  getPackagesByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<PackageListResponse> {

    const params = new HttpParams()
      .set(
        'startDate',
        startDate.toISOString()
      )
      .set(
        'endDate',
        endDate.toISOString()
      );

    return this.http.get<PackageListResponse>(
      `${this.apiUrl}/GetByDateRange`,
      { params }
    );
  }


  createPackage(
    request: PackageRequest
  ): Observable<PackageCreateResponse> {

    return this.http.post<PackageCreateResponse>(
      `${this.apiUrl}/Create`,
      request
    );
  }


  updatePackage(
    request: PackageRequest
  ): Observable<ApiMessageResponse> {

    return this.http.put<ApiMessageResponse>(
      `${this.apiUrl}/Update`,
      request
    );
  }


  deactivatePackage(
    packageId: number,
    trnUser: string
  ): Observable<ApiMessageResponse> {

    const params = new HttpParams()
      .set(
        'packageId',
        packageId.toString()
      )
      .set(
        'trnUser',
        trnUser
      );

    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/Deactivate`,
      null,
      { params }
    );
  }
}