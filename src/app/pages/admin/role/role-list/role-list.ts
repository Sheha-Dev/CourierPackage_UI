import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { RoleModel } from '../../../../models/role';
import { RoleService } from '../../../../services/role.service';

import { ConfirmBox } from '../../../../components/confirm-box/confirm-box';

@Component({
  selector: 'app-role-list',
  standalone: true,

  imports: [
    ConfirmBox
  ],

  templateUrl: './role-list.html',
  styleUrl: './role-list.scss'
})
export class RoleList {

  @Input()
  roles: RoleModel[] = [];

  @Input()
  isLoading = false;

  @Output()
  edit =
    new EventEmitter<RoleModel>();

  @Output()
  deleted =
    new EventEmitter<string>();

  @Output()
  deleteError =
    new EventEmitter<string>();

  showDeleteConfirm = false;

  roleToDelete: RoleModel | null = null;

  isDeleting = false;

  constructor(
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) {}

  editRole(
    role: RoleModel
  ): void {

    this.edit.emit(role);

  }

  deleteRole(
    role: RoleModel
  ): void {

    this.roleToDelete =
      role;

    this.showDeleteConfirm =
      true;

  }

  confirmDelete(): void {

    if (
      !this.roleToDelete?.id ||
      this.isDeleting
    ) {
      return;
    }

    this.isDeleting = true;

    const roleId =
      this.roleToDelete.id;

    // this.roleService
    //   .deleteRole(roleId)
    //   .subscribe({

    //     next: response => {

    //       this.isDeleting = false;

    //       this.showDeleteConfirm = false;

    //       this.roleToDelete = null;

    //       this.deleted.emit(
    //         response.message ??
    //         'Role deleted successfully.'
    //       );

    //       this.cdr.detectChanges();

    //     },

    //     error: error => {

    //       console.error(
    //         'Delete role error:',
    //         error
    //       );

    //       this.isDeleting = false;

    //       this.showDeleteConfirm = false;

    //       this.roleToDelete = null;

    //       this.deleteError.emit(
    //         error.error?.message ??
    //         'Unable to delete role.'
    //       );

    //       this.cdr.detectChanges();

    //     }

    //   });

  }

  cancelDelete(): void {

    if (this.isDeleting) {
      return;
    }

    this.showDeleteConfirm =
      false;

    this.roleToDelete =
      null;

  }

}