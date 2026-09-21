import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { forkJoin } from 'rxjs';

import { BoxTypeService } from '../../../../services/box-type.service';
import { BoxType } from '../../../../models/box-type';

import { WarehouseService } from '../../../../services/warehouse.service';
import { WarehouseListItem } from '../../../../models/warehouse';

import {
  MapComponent,
  MapOutputData,
  MapPoint
} from '../../../../components/map/map';

import { LocationService } from '../../../../services/location.service';

import {
  PackageService,
  PackageRequest
} from '../../../../services/package.service';

import { Location, LocationRequest } from '../../../../models/location';
import { TokenService } from '../../../../services/token.service';
import { RecipientService } from '../../../../services/recipient.service';
import { RecipientResponse } from '../../../../models/recipient';
import { PackageListItem } from '../package-list/package-list';


@Component({
  selector: 'app-package-add',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MapComponent
  ],

  templateUrl: './package-add.html',
  styleUrl: './package-add.scss'
})
export class PackageAdd implements OnInit {

  // ==================================================
  // MASTER DATA
  // ==================================================

  boxTypes: BoxType[] = [];
  warehouses: WarehouseListItem[] = [];
  destinationPoints: MapPoint[] = [];
  recipients: RecipientResponse[] = [];

  location! : Location ;
  // ==================================================
  // FORM
  // ==================================================

  packageForm!: FormGroup;
  
  currentUser : string = '';

  // ==================================================
  // CREATE / UPDATE
  // ==================================================

  updateMode = false;

  packageId = 0;


  // ==================================================
  // SELECTED DESTINATION
  // ==================================================

  selectedDestination: MapPoint | null = null;


  // ==================================================
  // CONSTRUCTOR
  // ==================================================

  constructor(
    private fb: FormBuilder,
    private boxTypeService: BoxTypeService,
    private warehouseService: WarehouseService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private packageService: PackageService,
    private tokenService: TokenService,
    private recipientService: RecipientService
  ) {

    this.formInit();

    this.currentUser = this.tokenService.getUserId() ?? '';
  }


  // ==================================================
  // INIT
  // ==================================================

  ngOnInit(): void {

    this.loadMasterData();
  }


  // ==================================================
  // FORM INITIALIZATION
  // ==================================================

  formInit(): void {

    this.packageForm = this.fb.group({

      boxTypeId: [
        '',
        Validators.required
      ],

      boxHeight: [
        '',
        [
          Validators.required,
          Validators.min(0.1)
        ]
      ],

      boxWidth: [
        '',
        [
          Validators.required,
          Validators.min(0.1)
        ]
      ],

      boxLength: [
        '',
        [
          Validators.required,
          Validators.min(0.1)
        ]
      ],

      estimatedWeight: [
        '',
        [
          Validators.required,
          Validators.min(0.1)
        ]
      ],

      handoverWarehouseId: [
        '',
        Validators.required
      ],

      destinationLongitude: [
        '',
        Validators.required
      ],

      destinationLatitude: [
        '',
        Validators.required
      ],

      recipientId: [
        '',
        Validators.required
      ],
      estimatedAmount: [
        '',
        Validators.required
      ],

      receivedDate: [
        '',
        Validators.required
      ],

      deliveryDate: [
        '',
        Validators.required
      ]

    });
  }


  // ==================================================
  // LOAD MASTER DATA
  // ==================================================

  loadMasterData(): void {

    forkJoin({

      allBoxTypes:
        this.boxTypeService.getAllBoxTypes(),

      allWarehouses:
        this.warehouseService.getAllWarehouses(),
      allRecipients:
        this.recipientService.getAllRecipientsByUser(this.currentUser)

    }).subscribe({

      next: (response) => {

        console.log(
          'Master data loaded:',
          response
        );


        this.boxTypes =
          response.allBoxTypes.data;


        this.warehouses =
          response.allWarehouses.data;

        this.recipients =
          response.allRecipients.data;


        this.setMapDestinationPoints();


        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Failed to load master data:',
          error
        );

        alert(
          'Failed to load package master data.'
        );
      }

    });
  }

  async loadPackage(packageData:PackageListItem){

    console.log('Selected Package:',packageData);

    await this.locationService.getLocationById(packageData.destinationId).subscribe
    (
      (response) => {
          this.location = response.data;
          this.getDestinationPointValue();
          console.log('Des Loc:',this.location);
      },
      (error) => {
        console.log('Error:',error.error.message);
        
      }
    );

    this.packageForm.patchValue({

          boxTypeId:
            packageData.boxTypeId,

          estimatedWeight:
            packageData.estimatedWeight,

          handoverWarehouseId:
            packageData.handOverWarehouseId,

          recipientId:
            packageData.recipientId,

          estimatedAmount:
            packageData.estimatedAmount,

          receivedDate:
            this.formatDate(
              packageData.receivedDate
            ),

          deliveryDate:
            this.formatDate(
              packageData.expectedDeliverDate
            ),

          boxWidth :
            packageData.boxWidth,
          
          boxLength : 
            packageData.boxLength,
          
          boxHeight :
            packageData.boxHeight,

          
        });
  }


  // ==================================================
  // SET MAP DESTINATION POINTS
  // ==================================================

  setMapDestinationPoints(): void {

    this.destinationPoints =
      this.warehouses.map(
        warehouse => ({

          pointName:
            warehouse.warehouseName,

          latitude:
            warehouse.warehouseLatitude,

          longitude:
            warehouse.warehouseLongitude

        })
      );
  }


  // ==================================================
  // GET WAREHOUSE LOCATION
  // ==================================================

  getLocation(
    locationId: number
  ): void {

    this.locationService
      .getLocationById(locationId)
      .subscribe({

        next: (response) => {

          console.log(
            'Location loaded:',
            response
          );

          this.setMapDestinationPoints();
        },

        error: (error) => {

          console.error(
            'Failed to load warehouse location:',
            error
          );
        }

      });
  }


  // ==================================================
  // DESTINATION SELECTED FROM MAP
  // ==================================================

  onDestinationPointChange(
    event: MapOutputData
  ): void {

    console.log(
      'Destination selected:',
      event
    );


    // Store selected destination
    this.selectedDestination =
      event.destination;


    // Store coordinates in form
    this.packageForm.patchValue({

      destinationLatitude:
        event.destination.latitude,

      destinationLongitude:
        event.destination.longitude

    });


    // Calculate estimated amount
    this.getEstimatedCost(event);


    this.cdr.detectChanges();
  }


  // ==================================================
  // GET SOURCE / WAREHOUSE LOCATION
  // ==================================================

  getsourcePointValue(): MapPoint {

    const warehouseId =
      this.packageForm
        .get('handoverWarehouseId')
        ?.value;


    const warehouse =
      this.warehouses.find(
        x =>
          x.warehouseId == warehouseId
      );


    console.log(
      'Selected Warehouse:',
      warehouse
    );


    const pointValue: MapPoint = {

      pointName:
        warehouse?.warehouseName,

      latitude:
        warehouse?.warehouseLatitude ?? 6.9337,

      longitude:
        warehouse?.warehouseLongitude ?? 79.8499

    };


    console.log(
      'Source Point:',
      pointValue
    );


    return pointValue;
  }

  getDestinationPointValue(): MapPoint{

    const pointValue: MapPoint = {

      pointName:
        '',

      latitude:
        this.location?.latitudeCoordinate ?? 6.9337,

      longitude:
        this.location?.longitudeCoordinate ?? 80.8499

    };

    return pointValue;
  }


  // ==================================================
  // ESTIMATED COST
  // ==================================================

  getEstimatedCost(
    event: MapOutputData
  ): number {

    const weight =
      Number(
        this.packageForm
          .get('estimatedWeight')
          ?.value
      ) || 0;


    const distance =
      Number(
        event.routeDistanceKm
      ) || 0;


    let amount = 350;


    // Weight charge
    if (weight > 1) {

      amount +=
        (weight - 1) * 100;
    }


    // Distance charge
    if (distance > 10) {

      amount +=
        (distance - 10) * 50;
    }


    console.log(
      'Weight:',
      weight
    );

    console.log(
      'Route Distance:',
      distance
    );

    console.log(
      'Estimated Amount:',
      amount
    );


    this.packageForm
      .get('estimatedAmount')
      ?.setValue(amount);


    return amount;
  }


  // ==================================================
  // SUBMIT
  // ==================================================

  onSubmit(): void {

    if (this.packageForm.invalid) {

      this.packageForm.markAllAsTouched();

      console.log(
        'Form is invalid:',
        this.packageForm.value
      );

      return;
    }


    // Destination must be selected
    if (!this.selectedDestination) {

      alert(
        'Please select a delivery destination on the map.'
      );

      return;
    }


    if (this.updateMode) {

      this.updatepackage();

    } else {

      this.createpackage();
    }
  }


  // ==================================================
  // CREATE PACKAGE
  // ==================================================

  createpackage(): void {

    const request =
      this.buildPackageRequest();


    console.log(
      'Creating package:',
      request
    );


    this.packageService
      .createPackage(request)
      .subscribe({

        next: (response) => {

          console.log(
            'Package created successfully:',
            response
          );


          alert(
            response.message ||
            'Package created successfully.'
          );


          // Reset form
          this.packageForm.reset();


          // Clear selected destination
          this.selectedDestination =
            null;
        },


        error: (error) => {

          console.error(
            'Create package failed:',
            error
          );


          console.error(
            'API error:',
            error?.error
          );


          alert(
            error?.error?.message ||
            'Failed to create package.'
          );
        }

      });
  }


  // ==================================================
  // UPDATE PACKAGE
  // ==================================================

  updatepackage(): void {

    const request =
      this.buildPackageRequest();


    request.packageId =
      this.packageId;


    console.log(
      'Updating package:',
      request
    );


    this.packageService
      .updatePackage(request)
      .subscribe({

        next: (response) => {

          console.log(
            'Package updated successfully:',
            response
          );


          alert(
            response.message ||
            'Package updated successfully.'
          );
        },


        error: (error) => {

          console.error(
            'Update package failed:',
            error
          );


          console.error(
            'API error:',
            error?.error
          );


          alert(
            error?.error?.message ||
            'Failed to update package.'
          );
        }

      });
  }


  // ==================================================
  // DELETE / DEACTIVATE PACKAGE
  // ==================================================

  deletePackage(
    packageId: number
  ): void {

    if (!packageId) {

      console.error(
        'Invalid package ID.'
      );

      return;
    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this package?'
      );


    if (!confirmed) {

      return;
    }


    /*
     * Replace this with the actual
     * logged-in user ID/username.
     */
    const trnUser =
      'current-user';


    console.log(
      'Deactivating package:',
      packageId
    );


    this.packageService
      .deactivatePackage(
        packageId,
        trnUser
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Package deactivated successfully:',
            response
          );


          alert(
            response.message ||
            'Package deleted successfully.'
          );
        },


        error: (error) => {

          console.error(
            'Delete package failed:',
            error
          );


          console.error(
            'API error:',
            error?.error
          );


          alert(
            error?.error?.message ||
            'Failed to delete package.'
          );
        }

      });
  }


  // ==================================================
  // BUILD PACKAGE REQUEST
  // ==================================================

  private buildPackageRequest(): PackageRequest {

    const form =
      this.packageForm.value;


    /*
     * IMPORTANT:
     *
     * selectedDestination is the point
     * clicked by the user on the map.
     *
     * getsourcePointValue() is the warehouse.
     *
     * Therefore destination must use
     * selectedDestination.
     */


    const destination: LocationRequest = {

      locationId:
        0,

      latitude:
        Number(
          this.selectedDestination?.latitude
        ) || 0,

      longitude:
        Number(
          this.selectedDestination?.longitude
        ) || 0,

      isActive:
        true
    };


    const request: PackageRequest = {

      packageId:
        this.packageId,


      packageTrackingId:
        0,


      boxTypeId:
        Number(
          form.boxTypeId
        ),


      boxDimensionRequestDto: {

        boxDimensionId:
          0,

        height:
          Number(
            form.boxHeight
          ),

        width:
          Number(
            form.boxWidth
          ),

        length:
          Number(
            form.boxLength
          )
      },


      senderId:
        this.tokenService.getUserId() ?? '',


      recipientId:
        Number(form.recipientId),


      estimatedWeight:
        Number(
          form.estimatedWeight
        ),


      isVerified:
        false,


      statusId:
        1,


      handOverWarehouseId:
        Number(
          form.handoverWarehouseId
        ),


      destination:
        destination,


      estimatedAmount:
        Number(
          form.estimatedAmount
        ),


      receivedDate:
        this.formatDate(
          form.receivedDate
        ),


      expectedDeliverDate:
        this.formatDate(
          form.deliveryDate
        ),


      trnUser:
        this.tokenService.getUserId() ?? ''
    };


    console.log(
      'Final Package Request:',
      request
    );


    return request;
  }


  // ==================================================
  // DATE FORMAT
  // ==================================================

  private formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString().substring(0, 10);
  }

  return value.substring(0, 10);
}

}