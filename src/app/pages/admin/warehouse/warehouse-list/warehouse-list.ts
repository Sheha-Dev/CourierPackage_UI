import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  forkJoin
} from 'rxjs';
import { WarehouseFullRequestDto } from '../../../../models/warehouse';
import { WarehouseService } from '../../../../services/warehouse.service';
import { LocationService } from '../../../../services/location.service';
import { DistrictService } from '../../../../services/district.service';
import { ProvinceService } from '../../../../services/province.service';




@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './warehouse-list.html',
  styleUrl: './warehouse-list.scss'
})
export class WarehouseList
  implements OnInit {

  @Output()
  edit =
    new EventEmitter<
      WarehouseFullRequestDto
    >();


  warehouses: any[] = [];

  filteredWarehouses: any[] = [];

  locations: any[] = [];

  provinces: any[] = [];

  districts: any[] = [];

  allDistricts: any[] = [];

  searchText = '';

  loading = false;

  errorMessage = '';


  constructor(
    private warehouseService:
      WarehouseService,
    private locationService:
      LocationService,
    private cdr: ChangeDetectorRef,
    private provinceService:
      ProvinceService,

    private districtService:
      DistrictService
  ) { }


  ngOnInit(): void {

    this.loadInitialData();

  }


  loadInitialData(): void {

    forkJoin({

      provinceResponse:
        this.provinceService
          .getAllProvinces(),

      districtResponse:
        this.districtService
          .getAllDistricts()

    })
      .subscribe({

        next: response => {

          this.provinces =
            response.provinceResponse
              ?.data ?? [];


          this.allDistricts =
            response.districtResponse
              ?.data ?? [];


          this.districts =
            [...this.allDistricts];


          console.log(
            'Provinces:',
            this.provinces
          );

          console.log(
            'Districts:',
            this.districts
          );


          // Load warehouses only after
          // provinces + districts are loaded
          this.loadWarehouses();

        },

        error: error => {

          console.error(
            'Initial data loading error',
            error
          );

        }

      });

  }


  loadWarehouses(): void {

    this.loading = true;

    this.errorMessage = '';


    forkJoin({

      warehouseResponse:
        this.warehouseService
          .getAllWarehouses(),

      locationResponse:
        this.locationService
          .getAllLocations()

    })
      .subscribe({

        next: response => {

          this.warehouses =
            response
              .warehouseResponse
              ?.data ?? [];

          console.log("Warehouses:", this.warehouses);



          this.locations =
            response
              .locationResponse
              ?.data ?? [];


          this.filteredWarehouses =
            [...this.warehouses];


          this.loading = false;
          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to load warehouses.';

        }

      });

  }

  getProvinceName(
    provinceId: number
  ): string {
    const province = this.provinces.find(
      p => p.provinceId == provinceId
    );
    console.log("Province:", province);
    return province?.provinceName ?? '';
  }

  getDistrictName(
    districtId: number
  ): string {
    const district = this.districts.find(
      d => d.districtId === districtId
    );
    return district?.districtName ?? '';
  }

  search(): void {

    const searchValue =
      this.searchText
        .trim()
        .toLowerCase();


    if (!searchValue) {

      this.filteredWarehouses =
        [...this.warehouses];

      return;

    }


    this.filteredWarehouses =
      this.warehouses.filter(
        warehouse => {

          return (

            warehouse.warehouseName
              ?.toLowerCase()
              .includes(searchValue) ||

            warehouse.address
              ?.toLowerCase()
              .includes(searchValue) ||

            warehouse.streetName
              ?.toLowerCase()
              .includes(searchValue)

          );

        }
      );

  }


  editWarehouse(
    warehouse: any
  ): void {

    /*
      Your backend response shown earlier
      had WarehouseLocationId.

      This supports either naming.
    */

    const locationId =
      warehouse.locationId ??
      warehouse.warehouseLocationId;


    const location =
      this.locations.find(
        item =>
          Number(item.locationId) ===
          Number(locationId)
      );


    if (!location) {

      this.errorMessage =
        'Warehouse location information could not be found.';

      return;

    }


    const request:
      WarehouseFullRequestDto = {

      warehouse: {

        warehouseId:
          warehouse.warehouseId,

        warehouseName:
          warehouse.warehouseName,

        warehouseLocationId:
          Number(locationId),

        trnUser:
          warehouse.trnUser ??
          '',

        districtId:
          warehouse.districtId,

        provinceId:
          warehouse.provinceId,

        streetName:
          warehouse.streetName,

        address:
          warehouse.address

      },

      location: {

        locationId:
          location.locationId,

        longitude:
          Number(
            location.longitudeCoordinate
          ),

        latitude:
          Number(
            location.latitudeCoordinate
          ),

        trnUser:
          location.trnUser ??
          ''

      }

    };


    this.edit.emit(
      request
    );

  }


  deactivateWarehouse(
    warehouse: any
  ): void {

    const confirmed =
      window.confirm(
        `Deactivate "${warehouse.warehouseName}"?`
      );


    if (!confirmed) {
      return;
    }


    this.warehouseService
      .deactivateWarehouse(
        warehouse.warehouseId
      )
      .subscribe({

        next: () => {

          this.loadWarehouses();

        },

        error: error => {

          this.errorMessage =
            error?.error?.message ??
            'Unable to deactivate warehouse.';

        }

      });

  }

}