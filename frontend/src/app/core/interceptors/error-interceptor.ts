import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError(error => {
      switch (error) {
        case 401:
          localStorage.removeItem('token');
          router.navigateByUrl('/login');
          break;
        case 404:
          snackBar.open('Not found', 'Dismiss', { duration: 3000 });
          break;
        case 500:
          snackBar.open('Server error - try again later', 'Dismiss', { duration: 5000 });
          break;
        case 0:
          snackBar.open('Network error - is the server running?', 'Dismiss', { duration: 5000 });
          break;
      }
      return throwError( () => error);
    } )
  );
};