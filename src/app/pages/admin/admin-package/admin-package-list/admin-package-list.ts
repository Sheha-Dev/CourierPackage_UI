import { ChangeDetectorRef, Component } from '@angular/core';
import { PackageItem, PackageService } from '../../../../services/package.service';
import { TokenService } from '../../../../services/token.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  imports: [
    CommonModule,
    RouterModule
  ],
  selector: 'app-admin-package-list',
  styleUrl: './admin-package-list.scss',
  templateUrl: './admin-package-list.html',
})
export class AdminPackageList {

  loading = false;
  errorMessage = '';

  packages: PackageItem[] = [];
  filteredPackages: PackageItem[] = [];

  constructor(
    private packageService: PackageService,
    private cdr: ChangeDetectorRef,
    private tokenService : TokenService
  ) { }

  ngOnInit(): void {

    this.loadPackages();

  }


  public loadPackages(): void {

    this.loading = true;

    this.errorMessage = '';
    var userId = this.tokenService.getUserId() ?? '';

    this.packageService
      .getAllPackages()
      .subscribe({

        next: response => {

          console.log('Response:', response);
          console.log('Data:', response.data);
          console.log('Is Array:', Array.isArray(response.data));
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

          this.loading = false;
          
          this.cdr.detectChanges();

          this.errorMessage =
            'Unable to load packages.';


          

        }

      });

      
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
  
}
