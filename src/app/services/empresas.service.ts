import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { IEmpresa } from '../interfaces/empresa';


@Injectable({
    providedIn: 'root'
})
export class EmpresasService {
    private apiUrl = 'https://localhost:5000/api/Empresa';

    constructor(private http: HttpClient, private toastr: ToastrService) { }

    getEmpresas(): Observable<IEmpresa[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<IEmpresa[]>(this.apiUrl, { headers }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        const errorMessage = `Error: ${error.status} - ${error.message}`;
        console.error('Ocurrió un error:', errorMessage);
        this.toastr.error('No se pudieron obtener las empresas. Inténtelo de nuevo más tarde.', 'Error');
        return throwError(() => new Error('No se pudieron obtener las empresas. Inténtelo de nuevo más tarde.'));
    }
}
