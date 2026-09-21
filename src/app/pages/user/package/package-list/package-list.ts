import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';
import { PackageService } from '../../../../services/package.service';
import { PackageAdd } from '../package-add/package-add';



export interface PackageListItem {

  packageId: number;
  packageTrackingId: number;
  boxTypeId: number;
  boxHeight : number;
  boxLength : number;
  boxWidth : number;
  estimatedWeight: number;
  handOverWarehouseId: number;
  destinationId: number;
  recipientId:number;
  estimatedAmount: number;
  receivedDate: string;
  expectedDeliverDate: string;
  isVerified: boolean;
  statusId: number;

}


@Component({
  selector: 'app-package-list',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './package-list.html',
  styleUrl: './package-list.scss'
})
export class PackageList
  implements OnInit {

  @Output()  viewPackage = new EventEmitter<PackageListItem>();

  packages: PackageListItem[] = [];
  filteredPackages: PackageListItem[] = [];

  loading = false;

  errorMessage = '';


  searchText = '';


  constructor(
    private packageService: PackageService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.loadPackages();

  }


  public loadPackages(): void {

    this.loading = true;

    this.errorMessage = '';


    this.packageService
      .getAllPackages()
      .subscribe({

        next: response => {

          this.packages =
            response.data ?? [];

          console.log('Packages:',this.packages);

          this.filteredPackages = [
            ...this.packages
          ];


          this.loading = false;
          this.cdr.detectChanges();

        },


        error: error => {

          console.error(
            'Failed to load packages',
            error
          );


          this.errorMessage =
            'Unable to load packages.';


          this.loading = false;

        }

      });

  }


  onView(selectedPackage:PackageListItem){
    this.viewPackage.emit(selectedPackage);
  }


  onSearch(): void {

    const value =
      this.searchText
        .trim()
        .toLowerCase();


    if (!value) {

      this.filteredPackages = [
        ...this.packages
      ];

      return;

    }


    this.filteredPackages =
      this.packages.filter(
        item =>

          item.packageId
            .toString()
            .includes(value)

          ||

          item.packageTrackingId
            .toString()
            .includes(value)

          ||

          item.handOverWarehouseId
            .toString()
            .includes(value)

          ||

          item.destinationId
            .toString()
            .includes(value)

      );

  }


  clearSearch(): void {

    this.searchText = '';

    this.filteredPackages = [
      ...this.packages
    ];

  }


  deactivatePackage(
    packageId: number
  ): void {

    const trnUser =
      sessionStorage.getItem(
        'userName'
      ) ?? 'System';


    const confirmed =
      window.confirm(
        'Are you sure you want to deactivate this package?'
      );


    if (!confirmed) {
      return;
    }


    this.packageService
      .deactivatePackage(
        packageId,
        trnUser
      )
      .subscribe({

        next: () => {

          this.loadPackages();

        },


        error: error => {

          console.error(
            'Failed to deactivate package',
            error
          );

        }

      });

  }


  getStatusLabel(
    statusId: number
  ): string {

    switch (statusId) {

      case 1:
        return 'Pending';

      case 2:
        return 'In Transit';

      case 3:
        return 'Delivered';

      case 4:
        return 'Cancelled';

      default:
        return 'Unknown';

    }

  }


  getStatusClass(
    statusId: number
  ): string {

    switch (statusId) {

      case 1:
        return 'status-pending';

      case 2:
        return 'status-transit';

      case 3:
        return 'status-delivered';

      case 4:
        return 'status-cancelled';

      default:
        return 'status-default';

    }

  }


  trackByPackageId(
    index: number,
    item: PackageListItem
  ): number {

    return item.packageId;

  }

}