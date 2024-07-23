import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IUsuario } from '../interfaces/usuario';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private apiUrl = 'http://localhost:8080/api/login';

    constructor(private http: HttpClient) { }

    login(username: string, contrasenia: string): Observable<IUsuario> {
        const headers = new HttpHeaders({
        'Content-Type': 'application/json'
        });
        const body = { username, contrasenia };

        return this.http.post<IUsuario>(this.apiUrl, body, { headers })
        .pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        return throwError(() => new Error(error.message || 'Server Error'));
    }
}
