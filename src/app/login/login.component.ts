import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';
import { IUsuario } from '../interfaces/usuario';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    FormLogin: FormGroup;
    passwordVisible: boolean = false;
    usuario: any;
    errorMessage: string | null = null;

    constructor(private _fb: FormBuilder, private _router: Router, private loginService: LoginService, private toastr: ToastrService) {
        this.FormLogin = this._fb.group({
            username: ['', Validators.required],
            contrasenia: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        localStorage.removeItem('token');
    }

    login() {
        if (this.FormLogin.valid) {
            const { username, contrasenia } = this.FormLogin.value;
            this.loginService.login(username, contrasenia).subscribe(
                (response) => {
                    const token = response.token;
                    if (token) {
                        localStorage.setItem('token', token);
                        this.getUsuario();
                        this._router.navigate(['/bienvenida']);
                    } else {
                        this.toastr.error("Error en la respuesta del servidor", 'Inicio incorrecto');
                    }
                },
                (error) => {
                    this.toastr.error("Error de credenciales", 'Inicio incorrecto');
                }
            );
        } else {
            this.toastr.error('Llene todos los campos', 'Error de validación');
        }
    }

    async getUsuario() {
        const token = localStorage.getItem('token');
    
        if (!token) {
            return;
        }

        this.loginService.getUsuarioDetail().subscribe(
            (data: IUsuario) => {
                this.usuario = data;
            },
            (error) => {
                this.errorMessage = error.message;
                this.toastr.error("Ocurrio un error", 'Error al obtener el usuario');
            }
        );
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }
}
