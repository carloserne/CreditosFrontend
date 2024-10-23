import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IPago } from '../interfaces/pago';
import { catchError, Observable, throwError } from 'rxjs';
import { IPagoAplicado } from '../interfaces/pagoAplicado';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private apiUrl = 'https://financlick.somee.com/api/Pagos';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getPagos(id: number): Observable<IPago[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http
      .get<IPago[]>(`${this.apiUrl}/PagosCredito/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  registrarPago(pago: IPagoAplicado): Observable<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<string>(`${this.apiUrl}/registrarPago`, pago, { headers, responseType: 'text' as 'json' }).pipe(
      catchError(error => {
        console.error('Error registering payment:', error);
        this.toastr.error('Error al registrar el pago.');
        return throwError(() => new Error('Error registering payment'));
      })
    );
  }

  aplicarPago(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post<string>(`${this.apiUrl}/aplicarPago/${id}`, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error applying payment:', error);
          return throwError(() => new Error('Error applying payment'));
        })
      );
  }

  


  private handleError(error: any): Observable<never> {
    const errorMessage = `Error: ${error.status} - ${error.message}`;
    console.error('Ocurrió un error:', errorMessage);
    this.toastr.error('No se pudieron obtener los Pagos. Inténtelo de nuevo más tarde.', 'Error');
    return throwError(() => new Error('No se pudieron obtener los Pagos. Inténtelo de nuevo más tarde.'));
  }
}
