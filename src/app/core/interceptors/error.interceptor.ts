import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {

      let mensaje = 'Error inesperado';

      if (error?.error?.message) {
        mensaje = error.error.message;
      }

      snackBar.open(mensaje, 'Cerrar', {
        duration: 3000
      });

      return throwError(() => error);
    })
  );
};