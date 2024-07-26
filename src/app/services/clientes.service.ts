import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ICliente } from '../interfaces/cliente';

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private apiUrl = 'https://localhost:5000/api/Cliente';

    constructor(private http: HttpClient, private toastr: ToastrService) { }

    getClientes(): Observable<ICliente[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<{ cliente: ICliente }[]>(this.apiUrl, { headers }).pipe(
            map(response => response.map(item => item.cliente)), 
            catchError(this.handleError)
        );
    }

    insertarCliente(cliente: ICliente): Observable<ICliente> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<ICliente>(this.apiUrl, cliente, { headers }).pipe(
            catchError(error => {
                console.error('Error saving client:', error);
                this.toastr.error('Error al guardar el cliente.');
                return throwError(() => new Error('Error saving client'));
            })
        );
    }

    actualizarCliente(cliente: ICliente): Observable<ICliente> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.put<ICliente>(`${this.apiUrl}/${cliente.idCliente}`, cliente, { headers }).pipe(
            catchError(error => {
                console.error('Error updating client:', error);
                this.toastr.error('Error al actualizar el cliente.');
                return throwError(() => new Error('Error updating client'));
            })
        );
    }

    eliminarCliente(id: number | null): Observable<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        return this.http.delete<void>(`${this.apiUrl}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).pipe(
            catchError(error => {
                console.error('Error al eliminar la empresa', error);
                return throwError(() => new Error('Error al eliminar la empresa'));
            })
        );
    }

    private handleError(error: any): Observable<never> {
        this.toastr.error('Error al obtener los datos.');
        return throwError(() => error);
    }
}