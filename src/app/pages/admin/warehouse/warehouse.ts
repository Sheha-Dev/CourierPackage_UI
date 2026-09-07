import {
  Component,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';
import { WarehouseAdd } from './warehouse-add/warehouse-add';
import { WarehouseList } from './warehouse-list/warehouse-list';
import { WarehouseFullRequestDto } from '../../../models/warehouse';


@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    CommonModule,
    WarehouseAdd,
    WarehouseList
  ],
  templateUrl: './warehouse.html',
  styleUrl: './warehouse.scss'
})
export class Warehouse {

  @ViewChild(WarehouseAdd)
  warehouseAddComponent?: WarehouseAdd;

  @ViewChild(WarehouseList)
  warehouseListComponent?: WarehouseList;

  selectedWarehouse:
    WarehouseFullRequestDto | null = null;

  editWarehouse(
    warehouse: WarehouseFullRequestDto
  ): void {

    this.selectedWarehouse = warehouse;

    setTimeout(() => {
      this.warehouseAddComponent
        ?.loadWarehouse(warehouse);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  warehouseSaved(): void {

    this.selectedWarehouse = null;

    this.warehouseListComponent
      ?.loadWarehouses();
  }
}