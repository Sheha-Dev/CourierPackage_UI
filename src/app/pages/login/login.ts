import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm: FormGroup;

  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const loginOb = {
      userName: this.loginForm.value.userName,
      passWord: this.loginForm.value.password
    };

    this.userService.login(loginOb).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        sessionStorage.setItem(
          'access_token',
          response.accessToken
        );

        this.router.navigate(['/home']);
      },

      error: (error) => {
        this.isLoading = false;
        
        this.loginError =
            error.error?.message ??
            'Invalid user name or password.';      
        this.cdr.detectChanges();
      }
    });
  }

  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }
}