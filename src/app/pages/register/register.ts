import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { UserService } from '../../services/user.service';
import { UserRegisterRequest } from '../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  registerForm: FormGroup;

  isLoading = false;
  registerError = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.registerForm = this.fb.group({
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

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]
    });
  }

  register(): void {

    if (this.isLoading) {
      return;
    }

    this.registerError = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const password =
      this.registerForm.get('password')?.value;

    const confirmPassword =
      this.registerForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.registerError =
        'Password and confirm password do not match.';

      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const registerOb : UserRegisterRequest = {
      userName: this.registerForm.value.userName,
      password: this.registerForm.value.password,
      email: this.registerForm.value.email,
      phoneNumber: this.registerForm.value.phoneNumber,
      nickName: this.registerForm.value.nickName,
      trnUser: 'User',
      roleName: 'User'
    };

    this.userService.register(registerOb).subscribe({

      next: (response: any) => {

        this.isLoading = false;

        this.successMessage =
          response?.message ||
          'Account created successfully.';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },

      error: (error) => {

        this.isLoading = false;

        if (error.status === 400) {

          if (error.error?.message) {
            this.registerError =
              error.error.message;
          }
          else if (error.error?.errors) {

            const errors = error.error.errors;

            const firstErrorKey =
              Object.keys(errors)[0];

            this.registerError =
              errors[firstErrorKey]?.[0] ||
              'Registration failed.';
          }
          else {
            this.registerError =
              'Please check the entered details.';
          }

        }
        else if (error.status === 409) {

          this.registerError =
            'User already exists.';

        }
        else if (error.status === 0) {

          this.registerError =
            'Unable to connect to the server.';

        }
        else {

          this.registerError =
            'Registration failed. Please try again.';

        }

        console.error(
          'Registration failed',
          error
        );

        this.cdr.detectChanges();
      }

    });
  }


  get userName() {
    return this.registerForm.get('userName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }

  get nickName() {
    return this.registerForm.get('nickName');
  }


  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}