import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { IUsuario } from '../interfaces/usuario';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private apiUrl = 'https://localhost:5000/api/Usuario';
    private usuario: IUsuario | null = null;

    constructor(private http: HttpClient) { }

    login(usuario: string, contrasenia: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        const body = { usuario, contrasenia };

        return this.http.post<any>(`${this.apiUrl}/login`, body, { headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    getUsuarioDetail(): Observable<IUsuario> {
        const token = localStorage.getItem('token');
        if (!token) {
            return throwError(() => new Error('No token found'));
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<IUsuario>(`${this.apiUrl}/detail`, { headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    obtenerUsuario(): Observable<IUsuario | null> {
        if (this.usuario) {
            return of(this.usuario);
        } else {
            return this.getUsuarioDetail();
        }
    }

    private handleError(error: any): Observable<never> {
        return throwError(() => new Error(error.message || 'Server Error'));
    }
}
