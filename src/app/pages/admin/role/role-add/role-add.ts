import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RoleService } from '../../../../services/role.service';
import { RoleModel } from '../../../../models/role';

@Component({
  selector: 'app-role-add',
  standalone: true,

  imports: [
    ReactiveFormsModule
  ],

  templateUrl: './role-add.html',
  styleUrl: './role-add.scss'
})
export class RoleAdd implements OnChanges {

  @Input()
  selectedRole: RoleModel | null = null;

  @Output()
  saved =
    new EventEmitter<string>();

  @Output()
  saveError =
    new EventEmitter<string>();

  @Output()
  cancelEdit =
    new EventEmitter<void>();

  roleForm: FormGroup;

  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) {

    this.roleForm =
      this.fb.group({

        roleName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50)
          ]
        ]

      });

  }

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['selectedRole']
    ) {

      if (this.selectedRole) {

        this.roleForm.patchValue({
          roleName:
            this.selectedRole.name
        });

      } else {

        this.roleForm.reset();

      }

    }

  }

  get isEditMode(): boolean {

    return !!this.selectedRole?.id;

  }

  saveRole(): void {

    if (this.isSaving) {
      return;
    }

    if (this.roleForm.invalid) {

      this.roleForm.markAllAsTouched();

      return;
    }

    const roleName =
      this.roleForm
        .get('roleName')
        ?.value
        ?.trim();

    if (!roleName) {
      return;
    }

    if (this.isEditMode) {

      this.updateRole(roleName);

    } else {

      this.createRole(roleName);

    }

  }

  private createRole(
    roleName: string
  ): void {

    this.isSaving = true;

    this.roleService
      .createRole(roleName)
      .subscribe({

        next: response => {

          this.isSaving = false;

          this.roleForm.reset();

          this.saved.emit(
            response.message ??
            'Role created successfully.'
          );

          this.cdr.detectChanges();

        },

        error: error => {

          console.error(
            'Create role error:',
            error
          );

          this.isSaving = false;

          this.saveError.emit(
            error.error?.message ??
            'Unable to create role.'
          );

          this.cdr.detectChanges();

        }

      });

  }

  private updateRole(
    roleName: string
  ): void {

    if (!this.selectedRole?.id) {
      return;
    }

    this.isSaving = true;

    // this.roleService
    //   .updateRole(
    //     this.selectedRole.id,
    //     roleName
    //   )
    //   .subscribe({

    //     next: response => {

    //       this.isSaving = false;

    //       this.roleForm.reset();

    //       this.saved.emit(
    //         response.message ??
    //         'Role updated successfully.'
    //       );

    //       this.cdr.detectChanges();

    //     },

    //     error: error => {

    //       console.error(
    //         'Update role error:',
    //         error
    //       );

    //       this.isSaving = false;

    //       this.saveError.emit(
    //         error.error?.message ??
    //         'Unable to update role.'
    //       );

    //       this.cdr.detectChanges();

    //     }

    //   });

  }

  cancel(): void {

    this.roleForm.reset();

    this.cancelEdit.emit();

  }

  get roleName() {
    return this.roleForm.get('roleName');
  }

}