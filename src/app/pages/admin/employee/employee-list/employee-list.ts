import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { UserService } from '../../../../services/user.service';
import { ConfirmBox } from '../../../../components/confirm-box/confirm-box';

export interface EmployeeUser {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  nickName?: string;

  roles?: string[];

  isActive?: boolean;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,

  imports: [
    CommonModule,
    ConfirmBox
  ],

  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeList implements OnInit {

  @Output()
  edit =
    new EventEmitter<EmployeeUser>();

  users: EmployeeUser[] = [];

  isLoading = false;

  errorMessage = '';
  successMessage = '';

  selectedUser:
    EmployeeUser | null = null;

  showDeactivateConfirm = false;

  isDeactivating = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadUsers();

  }


  loadUsers(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.userService
      .getUserList()
      .subscribe({

        next: response => {

          this.users =
            response.data ?? [];

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'User list error:',
            error
          );

          this.errorMessage =
            error.error?.message ??
            'Unable to load users.';

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  editUser(
    user: EmployeeUser
  ): void {

    this.edit.emit(user);

  }


  deactivateUser(
    user: EmployeeUser
  ): void {

    this.selectedUser =
      user;

    this.showDeactivateConfirm =
      true;

  }


  confirmDeactivate(): void {

    if (
      !this.selectedUser ||
      this.isDeactivating
    ) {
      return;
    }

    this.isDeactivating =
      true;

    
    this.userService
  .deactivateUser(this.selectedUser.userName)
  .subscribe({
    next: (response) => {
      console.log(response.message);

    },

    error: (error) => {
      console.error(error);

      const message =
        error?.error?.message ??
        'Failed to deactivate user.';

      console.error(message);
    }
  });

    console.log(
      'Deactivate user:',
      this.selectedUser
    );

    this.successMessage =
      `${this.selectedUser.userName} deactivated successfully.`;

    this.showDeactivateConfirm =
      false;

    this.selectedUser =
      null;

    this.isDeactivating =
      false;

  }


  cancelDeactivate(): void {

    if (this.isDeactivating) {
      return;
    }

    this.showDeactivateConfirm =
      false;

    this.selectedUser =
      null;

  }

}