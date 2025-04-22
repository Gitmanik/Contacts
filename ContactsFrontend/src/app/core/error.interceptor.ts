import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage: string;

      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = JSON.stringify(error.error);
        }
      } else {
        errorMessage = error.message || 'Wystąpił błąd podczas przetwarzania żądania.';
      }

      snackBar.open(
        errorMessage,
        'Zamknij',
        {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }
      );

      return throwError(() => error);
    })
  );
};
