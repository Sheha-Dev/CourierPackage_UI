

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('access_token');

  let request = req;

  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        localStorage.removeItem('access_token');

        router.navigate(['/login']);
      }

      if (error.status === 403) {
        console.error('Access denied');
      }

      if (error.status === 500) {
        console.error('Server error');
      }

      return throwError(() => error);
    })
  );
};