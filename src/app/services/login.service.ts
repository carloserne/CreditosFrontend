import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IUsuario } from '../interfaces/usuario';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private apiUrl = 'https://localhost:5000/api/Usuario/login';

    constructor(private http: HttpClient) { }

    login(usuario: string, contrasenia: string): Observable<string> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        const body = { usuario, contrasenia };

        return this.http.post<string>(this.apiUrl, body, { headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: any): Observable<never> {
        return throwError(() => new Error(error.message || 'Server Error'));
    }
}
