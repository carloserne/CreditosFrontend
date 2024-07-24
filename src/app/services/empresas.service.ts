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

    guardarEmpresa(empresa: IEmpresa): Observable<IEmpresa> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<IEmpresa>(this.apiUrl, empresa, { headers })
            .pipe(
                catchError(error => {
                console.error('Error saving company:', error);
                return throwError(() => new Error('Error saving company'));
                })
            );
    }

    actualizarEmpresa(empresa: IEmpresa): Observable<IEmpresa> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }
    
        return this.http.put<IEmpresa>(`${this.apiUrl}/${empresa.idEmpresa}`, empresa, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).pipe(
        catchError(error => {
            console.error('Error al actualizar la empresa', error);
            return throwError(() => new Error('Error al actualizar la empresa'));
        })
        );
    }

    eliminarEmpresa(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/eliminar`, null);
    }

    private handleError(error: any): Observable<never> {
        const errorMessage = `Error: ${error.status} - ${error.message}`;
        console.error('Ocurrió un error:', errorMessage);
        this.toastr.error('No se pudieron obtener las empresas. Inténtelo de nuevo más tarde.', 'Error');
        return throwError(() => new Error('No se pudieron obtener las empresas. Inténtelo de nuevo más tarde.'));
    }
}
