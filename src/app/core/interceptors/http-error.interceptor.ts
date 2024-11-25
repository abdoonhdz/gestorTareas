import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error inesperado';

        if (error.status === 0) {
          errorMessage = 'Error de conexión con el servidor. Intentalo nuevamente.';
        } else if (error.status === 400) {
          errorMessage = 'La solicitud no es válida. Verifica los datos enviados.';
        } else if (error.status === 404) {
          errorMessage = 'No se encontró el recurso solicitado.';
        } else if (error.status === 500) {
          errorMessage = 'Error interno en el servidor. Intentalo más tarde.';
        }

        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });

        return throwError(() => error);
      })
    );
  }
}
