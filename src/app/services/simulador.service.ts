import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ISimulador } from '../interfaces/simulador';

@Injectable({
    providedIn: 'root'
})
export class SimuladorService {
    private apiUrl = 'http://localhost:8080/api/simulador';

    constructor(private http: HttpClient) { }

    calcularSimulador(): Observable<ISimulador> {
        return this.http.get<ISimulador>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ha sucedido un error.';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error de red o cliente: ${error.error.message}`;
        } else {
            errorMessage = `Error interno del servidor ${error.status}, ` +
                            `Error: ${error.error}`;
        }
        return throwError(() => new Error(errorMessage));
    }
}
