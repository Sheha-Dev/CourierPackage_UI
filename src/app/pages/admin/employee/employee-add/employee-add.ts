import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { UserService } from '../../../../services/user.service';
import { RoleService } from '../../../../services/role.service';

export interface EmployeeModel {
  id?: string;

  userName: string;
  email: string;
  phoneNumber: string;
  nickName: string;

  position: string;
}

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './employee-add.html',
  styleUrl: './employee-add.scss'
})
export class EmployeeAdd implements OnInit,OnChanges {

  @Input() employee: EmployeeModel | null = null;

  @Output() saved =
    new EventEmitter<void>();

  @Output() cancelled =
    new EventEmitter<void>();

  employeeForm: FormGroup;

  isLoading = false;

  errorMessage = '';
  successMessage = '';

  positions: string[] = [
    'Manager',
    'Warehouse Manager',
    'Driver',
    'Delivery Officer',
    'Customer Support'
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService
  ) {

    this.employeeForm = this.fb.group({

      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phoneNumber: [
        '',
        [
          Validators.required
        ]
      ],

      nickName: [
        '',
        [
          Validators.required
        ]
      ],

      position: [
        '',
        [
          Validators.required
        ]
      ],

      password: [
        '',
        [
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        ''
      ]

    });

  }

  ngOnInit(): void {

    this.loadRoles();

  }

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['employee'] &&
      this.employee
    ) {

      this.loadEmployeeToForm();

    }

    if (
      changes['employee'] &&
      !this.employee
    ) {

      this.resetForm();

    }

  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: response => {
        this.positions = response.data.map(
          role => role.name
        );
        this.cdr.detectChanges();
      },
      error: error => {
        console.error(
          'Error loading roles:',
          error
        );
      }
    });
  }

  get isEditMode(): boolean {

    return !!this.employee?.id;

  }


  saveEmployee(): void {

    if (this.isLoading) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.applyPasswordValidation();

    if (this.employeeForm.invalid) {

      this.employeeForm.markAllAsTouched();

      return;
    }


    const password =
      this.employeeForm
        .get('password')
        ?.value;

    const confirmPassword =
      this.employeeForm
        .get('confirmPassword')
        ?.value;


    if (
      !this.isEditMode &&
      password !== confirmPassword
    ) {

      this.errorMessage =
        'Password and confirm password do not match.';

      return;
    }


    if (
      this.isEditMode &&
      password &&
      password !== confirmPassword
    ) {

      this.errorMessage =
        'Password and confirm password do not match.';

      return;
    }


    if (this.isEditMode) {

      this.updateEmployee();

    } else {

      this.createEmployee();

    }

  }


  private createEmployee(): void {

    this.isLoading = true;

    const request = {

      userName:
        this.employeeForm.value.userName,

      password:
        this.employeeForm.value.password,

      email:
        this.employeeForm.value.email,

      phoneNumber:
        this.employeeForm.value.phoneNumber,

      nickName:
        this.employeeForm.value.nickName,

      trnUser: 'Admin',

      roleName:
        this.employeeForm.value.position

    };


    this.userService
      .register(request as any)
      .subscribe({

        next: response => {

          this.isLoading = false;

          this.successMessage =
            response?.message ??
            'Employee created successfully.';

          this.employeeForm.reset();

          this.saved.emit();

          this.cdr.detectChanges();

        },

        error: error => {

          this.isLoading = false;

          this.errorMessage =
            error.error?.message ??
            'Unable to create employee.';

          console.error(
            'Employee create error',
            error
          );

          this.cdr.detectChanges();

        }

      });

  }


  private updateEmployee(): void {

    if (!this.employee?.id) {
      return;
    }

    this.isLoading = true;


    const request = {

      id:
        this.employee.id,

      userName:
        this.employeeForm.value.userName,

      email:
        this.employeeForm.value.email,

      phoneNumber:
        this.employeeForm.value.phoneNumber,

      nickName:
        this.employeeForm.value.nickName,

      position:
        this.employeeForm.value.position

    };


    /*
      Replace this with your actual
      update employee service method.

      Example:

      this.userService
        .updateEmployee(request)
        .subscribe(...)
    */


    console.log(
      'Update employee request:',
      request
    );

    this.isLoading = false;

    this.successMessage =
      'Employee updated successfully.';

    this.saved.emit();

    this.cdr.detectChanges();

  }


  editEmployee(
    employee: EmployeeModel
  ): void {

    this.employee =
      employee;

    this.loadEmployeeToForm();

  }


  private loadEmployeeToForm(): void {

    if (!this.employee) {
      return;
    }

    this.employeeForm.patchValue({

      userName:
        this.employee.userName,

      email:
        this.employee.email,

      phoneNumber:
        this.employee.phoneNumber,

      nickName:
        this.employee.nickName,

      position:
        this.employee.position,

      password: '',

      confirmPassword: ''

    });

  }


  cancel(): void {

    this.resetForm();

    this.cancelled.emit();

  }


  resetForm(): void {

    this.employeeForm.reset();

    this.errorMessage = '';
    this.successMessage = '';

  }


  private applyPasswordValidation(): void {

    const passwordControl =
      this.employeeForm.get('password');

    const confirmPasswordControl =
      this.employeeForm.get('confirmPassword');


    if (!this.isEditMode) {

      passwordControl?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);

      confirmPasswordControl?.setValidators([
        Validators.required
      ]);

    } else {

      passwordControl?.setValidators([
        Validators.minLength(6)
      ]);

      confirmPasswordControl?.clearValidators();

    }


    passwordControl
      ?.updateValueAndValidity({
        emitEvent: false
      });

    confirmPasswordControl
      ?.updateValueAndValidity({
        emitEvent: false
      });

  }


  get userName() {
    return this.employeeForm.get('userName');
  }

  get email() {
    return this.employeeForm.get('email');
  }

  get phoneNumber() {
    return this.employeeForm.get('phoneNumber');
  }

  get nickName() {
    return this.employeeForm.get('nickName');
  }

  get position() {
    return this.employeeForm.get('position');
  }

  get password() {
    return this.employeeForm.get('password');
  }

  get confirmPassword() {
    return this.employeeForm.get(
      'confirmPassword'
    );
  }

}