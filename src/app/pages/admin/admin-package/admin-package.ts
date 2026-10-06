import { Component } from '@angular/core';
import { AdminPackageList } from './admin-package-list/admin-package-list';

@Component({
  imports: [AdminPackageList],
  selector: 'app-admin-package',
  styleUrl: './admin-package.scss',
  templateUrl: './admin-package.html',
})
export class AdminPackage {}
