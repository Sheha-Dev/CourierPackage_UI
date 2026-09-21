import {
  Component,
  ViewChild
} from '@angular/core';
import { PackageList,PackageListItem } from './package-list/package-list';
import { PackageAdd } from './package-add/package-add';

@Component({
  selector: 'app-package',
  standalone: true,

  imports: [
    PackageAdd,
    PackageList
  ],

  templateUrl: './package.html',
  styleUrl: './package.scss'
})
export class PackageComponent {

  @ViewChild(PackageList)
  packageList?: PackageList;

  @ViewChild(PackageAdd)
  packageAdd?: PackageAdd;

  onPackageSaved(): void {

    this.packageList
      ?.
      loadPackages();

  }

   onViewClick(selectedPackage: PackageListItem): void {

    this.packageAdd?.loadPackage(selectedPackage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }
}