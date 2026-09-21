import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../environments/environment';

import {
  BoxTypeListResponse
} from '../models/box-type';


@Injectable({
  providedIn: 'root'
})
export class BoxTypeService {

  private readonly apiUrl =
    `${environment.apiBaseUrl}/BoxType`;


  constructor(
    private http: HttpClient
  ) { }


  getAllBoxTypes():
    Observable<BoxTypeListResponse> {

    return this.http.get<BoxTypeListResponse>(
      `${this.apiUrl}/GetAll`
    );

  }

}