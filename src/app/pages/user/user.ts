import { Component } from '@angular/core';
import { PackageList } from '../../components/package-list/package-list';
import { PackageAdd } from './package/package-add/package-add';

@Component({
  imports: [PackageList, PackageAdd],
  selector: 'app-user',
  styleUrl: './user.scss',
  templateUrl: './user.html',
})
export class User {}
