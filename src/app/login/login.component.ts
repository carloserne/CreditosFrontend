import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

    constructor(private _fb: FormBuilder, private _router: Router) {
        this.FormLogin = this._fb.group({
            Id: [],
            Cuenta: ['', Validators.required],
            Clave: ['', Validators.required],
            Ip: []
        });
    }

    ngOnInit(): void {
        // Inicialización del formulario
    }

    Login() {
        // if (this.FormLogin.valid) {
            console.log("Redireccionando a inicio...");
            this._router.navigate(['inicio']);
        // }
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }
}
