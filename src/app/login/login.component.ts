import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';

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

    constructor(private _fb: FormBuilder, private _router: Router, private loginService: LoginService, private toastr: ToastrService) {
        this.FormLogin = this._fb.group({
            username: ['', Validators.required],
            contrasenia: ['', Validators.required]
        });
    }

    ngOnInit(): void {}

    login() {
        // if (this.FormLogin.valid) {
        //     const { username, contrasenia } = this.FormLogin.value;
        //     this.loginService.login(username, contrasenia).subscribe(
        //         (response) => {
        //             this._router.navigate(['/inicio']);
        //         },
        //         (error) => {
        //             this.toastr.error(error.message, 'Inicio incorrecto');
        //         }
        //     );
        // } else {
        //     this.toastr.error('Llene todos los campos', 'Error de validación');
        // }
        this._router.navigate(['/bienvenida']);
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }
}
