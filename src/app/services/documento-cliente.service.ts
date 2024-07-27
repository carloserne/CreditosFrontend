import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { INuevoDocumento } from './nuevoDocumento';

@Injectable({
    providedIn: 'root'
})
export class DocumentPorClienteService {
    private apiUrl = 'https://localhost:5000/api/DocumentoCliente';

    constructor(private http: HttpClient) {}

    getDocumentosCliente(id: number): Observable<any[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<any[]>(`${this.apiUrl}/cliente/${id}`, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    guardarDocumento(documento: INuevoDocumento): Observable<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.post<void>(`${this.apiUrl}/subir`, documento, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        // Manejo de errores
        console.error('An error occurred', error);
        return throwError(() => new Error('An error occurred while fetching data'));
    }
}
