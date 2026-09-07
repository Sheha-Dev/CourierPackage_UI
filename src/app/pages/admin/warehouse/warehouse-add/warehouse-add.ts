import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MapComponent,
  MapLocation
} from '../../../../components/map/map';

import {
  WarehouseFullRequestDto
} from '../../../../models/warehouse';

import {
  WarehouseService
} from '../../../../services/warehouse.service';

import {
  ProvinceService
} from '../../../../services/province.service';

import {
  DistrictService
} from '../../../../services/district.service';


@Component({
  selector: 'app-warehouse-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MapComponent
  ],
  templateUrl: './warehouse-add.html',
  styleUrl: './warehouse-add.scss'
})
export class WarehouseAdd
  implements OnInit {

  @Input()
  warehouse:
    WarehouseFullRequestDto | null = null;


  @Output()
  saved =
    new EventEmitter<void>();


  warehouseForm!: FormGroup;


  provinces: any[] = [];

  districts: any[] = [];

  allDistricts: any[] = [];


  selectedMapLocation:
    MapLocation[] = [];


  isEditMode = false;

  isSaving = false;

  message = '';

  errorMessage = '';


  constructor(
    private fb:
      FormBuilder,

    private warehouseService:
      WarehouseService,

    private provinceService:
      ProvinceService,

    private districtService:
      DistrictService
  ) { }


  ngOnInit(): void {

    this.createForm();

    this.loadProvinces();

    this.loadDistricts();


    /*
      If warehouse is already provided
      when component opens in edit mode.
    */
    if (this.warehouse) {

      this.loadWarehouse(
        this.warehouse
      );

    }

  }


  private createForm(): void {

    this.warehouseForm =
      this.fb.group({

        warehouseId: [
          null
        ],

        warehouseName: [
          '',
          [
            Validators.required,
            Validators.maxLength(150)
          ]
        ],

        provinceId: [
          null,
          Validators.required
        ],

        districtId: [
          null,
          Validators.required
        ],

        streetName: [
          '',
          Validators.required
        ],

        address: [
          '',
          Validators.required
        ],

        latitude: [
          null,
          Validators.required
        ],

        longitude: [
          null,
          Validators.required
        ]

      });

  }


  loadProvinces(): void {

    this.provinceService
      .getAllProvinces()
      .subscribe({

        next: response => {

          this.provinces =
            response?.data ?? [];

        },

        error: error => {

          console.error(
            'Province loading error',
            error
          );

        }

      });

  }


  loadDistricts(): void {

    this.districtService
      .getAllDistricts()
      .subscribe({

        next: response => {

          this.allDistricts =
            response?.data ?? [];


          this.districts =
            [...this.allDistricts];

        },

        error: error => {

          console.error(
            'District loading error',
            error
          );

        }

      });

  }


  provinceChanged(): void {

    const provinceId =
      Number(
        this.warehouseForm
          .get('provinceId')
          ?.value
      );


    const matchingDistricts =
      this.allDistricts.filter(
        district =>
          Number(
            district.provinceId
          ) === provinceId
      );


    this.districts =
      matchingDistricts.length > 0
        ? matchingDistricts
        : [...this.allDistricts];


    this.warehouseForm
      .get('districtId')
      ?.setValue(null);

  }


  mapPointSelected(
  location: MapLocation
): void {

  console.log(
    'Map location selected:',
    location
  );


  const latitude =
    Number(
      location.latitude
    );

  const longitude =
    Number(
      location.longitude
    );


  this.warehouseForm
    .get('latitude')
    ?.setValue(latitude);


  this.warehouseForm
    .get('longitude')
    ?.setValue(longitude);


  this.warehouseForm
    .get('latitude')
    ?.markAsTouched();


  this.warehouseForm
    .get('longitude')
    ?.markAsTouched();


  this.warehouseForm
    .get('latitude')
    ?.updateValueAndValidity();


  this.warehouseForm
    .get('longitude')
    ?.updateValueAndValidity();


  this.selectedMapLocation = [

    {
      latitude:
        latitude,

      longitude:
        longitude,

      label:
        this.warehouseForm
          .get('warehouseName')
          ?.value ||
        'Warehouse Location',

      description:
        this.warehouseForm
          .get('address')
          ?.value ||
        undefined
    }

  ];


  console.log(
    'Form coordinates:',
    {
      latitude:
        this.warehouseForm
          .get('latitude')
          ?.value,

      longitude:
        this.warehouseForm
          .get('longitude')
          ?.value
    }
  );

}


  loadWarehouse(
    warehouse:
      WarehouseFullRequestDto
  ): void {

    this.warehouse =
      warehouse;


    this.isEditMode = true;

    this.message = '';

    this.errorMessage = '';


    this.warehouseForm.patchValue({

      warehouseId:
        warehouse.warehouse
          .warehouseId,

      warehouseName:
        warehouse.warehouse
          .warehouseName,

      provinceId:
        warehouse.warehouse
          .provinceId,

      districtId:
        warehouse.warehouse
          .districtId,

      streetName:
        warehouse.warehouse
          .streetName,

      address:
        warehouse.warehouse
          .address,

      latitude:
        warehouse.location
          .latitude,

      longitude:
        warehouse.location
          .longitude

    });


    this.selectedMapLocation = [

      {
        latitude:
          warehouse.location
            .latitude,

        longitude:
          warehouse.location
            .longitude,

        label:
          warehouse.warehouse
            .warehouseName,

        description:
          warehouse.warehouse
            .address
      }

    ];

  }


  saveWarehouse(): void {

  this.message = '';
  this.errorMessage = '';

  if (this.warehouseForm.invalid) {

    this.warehouseForm.markAllAsTouched();

    this.errorMessage =
      'Please complete all required fields and select a location on the map.';

    return;
  }

  /*
    getRawValue() returns all form values,
    including disabled controls.
  */
  const value =
    this.warehouseForm.getRawValue();


  const latitude =
    Number(
      this.warehouseForm
        .get('latitude')
        ?.value
    );


  const longitude =
    Number(
      this.warehouseForm
        .get('longitude')
        ?.value
    );


  console.log(
    'Selected latitude:',
    latitude
  );

  console.log(
    'Selected longitude:',
    longitude
  );


  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {

    this.errorMessage =
      'Please select a valid warehouse location on the map.';

    return;
  }


  const trnUser =
    sessionStorage.getItem(
      'userName'
    ) ?? 'SYSTEM';


  const request:
    WarehouseFullRequestDto = {

    warehouse: {

      warehouseId:
        value.warehouseId ?? 0,

      warehouseName:
        value.warehouseName,

      provinceId:
        Number(
          value.provinceId
        ),

      districtId:
        Number(
          value.districtId
        ),

      streetName:
        value.streetName,

      address:
        value.address,

      trnUser:
        trnUser

    },

    location: {

      latitude:
        latitude,

      longitude:
        longitude,

      trnUser:
        trnUser

    }

  };


  /*
    Preserve IDs during update.
  */
  if (
    this.isEditMode &&
    this.warehouse
  ) {

    if (
      this.warehouse.location
        ?.locationId
    ) {

      request.location.locationId =
        this.warehouse
          .location.locationId;

    }


    if (
      this.warehouse.warehouse
        ?.warehouseLocationId
    ) {

      request.warehouse.warehouseLocationId =
        this.warehouse
          .warehouse.warehouseLocationId;

    }

  }


  console.log(
    'Warehouse request:',
    request
  );


  this.isSaving = true;


  if (this.isEditMode) {

    this.updateWarehouse(
      request
    );

  }
  else {

    this.createWarehouse(
      request
    );

  }

}


  private createWarehouse(
    request:
      WarehouseFullRequestDto
  ): void {

    this.warehouseService
      .createWarehouse(
        request
      )
      .subscribe({

        next: response => {

          this.isSaving = false;


          this.message =
            response?.message ??
            'Warehouse created successfully.';


          this.resetForm();


          this.saved.emit();

        },

        error: error => {

          this.isSaving = false;


          this.errorMessage =
            error?.error?.message ??
            'Unable to create warehouse.';

        }

      });

  }


  private updateWarehouse(
    request:
      WarehouseFullRequestDto
  ): void {

    this.warehouseService
      .updateWarehouse(
        request
      )
      .subscribe({

        next: response => {

          this.isSaving = false;


          this.message =
            response?.message ??
            'Warehouse updated successfully.';


          this.resetForm();


          this.saved.emit();

        },

        error: error => {

          this.isSaving = false;


          this.errorMessage =
            error?.error?.message ??
            'Unable to update warehouse.';

        }

      });

  }


  resetForm(): void {

    this.warehouseForm.reset();


    this.selectedMapLocation = [];


    this.isEditMode = false;


    this.warehouse = null;


    this.message = '';

    this.errorMessage = '';

  }


  hasError(
    controlName: string
  ): boolean {

    const control =
      this.warehouseForm
        .get(controlName);


    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }

}