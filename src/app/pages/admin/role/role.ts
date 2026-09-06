import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { RoleService } from '../../../services/role.service';
import { RoleModel } from '../../../models/role';

import { RoleAdd } from './role-add/role-add';
import { RoleList } from './role-list/role-list';

@Component({
  selector: 'app-role',
  standalone: true,

  imports: [
    RoleAdd,
    RoleList
  ],

  templateUrl: './role.html',
  styleUrl: './role.scss'
})
export class Role implements OnInit {

  roles: RoleModel[] = [];

  selectedRole: RoleModel | null = null;

  isLoading = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.roleService
      .getAllRoles()
      .subscribe({

        next: response => {

          this.roles =
            response.data ?? [];

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Role load error:',
            error
          );

          this.errorMessage =
            error.error?.message ??
            'Unable to load roles.';

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }

  onRoleSaved(
    message: string
  ): void {

    this.successMessage =
      message;

    this.errorMessage = '';

    this.selectedRole = null;

    this.loadRoles();

  }

  onRoleSaveError(
    message: string
  ): void {

    this.successMessage = '';

    this.errorMessage =
      message;

  }

  onEditRole(
    role: RoleModel
  ): void {

    this.selectedRole =
      role;

  }

  onCancelEdit(): void {

    this.selectedRole =
      null;

  }

  onRoleDeleted(
    message: string
  ): void {

    this.successMessage =
      message;

    this.errorMessage = '';

    if (
      this.selectedRole &&
      !this.roles.some(
        x => x.id === this.selectedRole?.id
      )
    ) {

      this.selectedRole =
        null;

    }

    this.loadRoles();

  }

  onRoleDeleteError(
    message: string
  ): void {

    this.successMessage = '';

    this.errorMessage =
      message;

  }

}