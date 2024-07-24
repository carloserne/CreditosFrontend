import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { IUsuario } from '../interfaces/usuario';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
    expandedMenu: string | null = null;
    usuario: IUsuario | null = null;
    errorMessage: any;

    constructor(private router: Router, private loginService: LoginService) {}

    ngOnInit(): void {
        this.loginService.obtenerUsuario().subscribe(
            (data) => {
                this.usuario = data;
            },
            (error) => {
                this.errorMessage = error;
            }
        );
    }

    getImageUrl(base64String: string | undefined): string {
        if (base64String) {
            return `data:image/${this.obtenerTipoImagen(base64String)};base64,${base64String}`;
        }
        return '/assets/images/user.jpg';
    }

    obtenerTipoImagen(base64String: string): string {
        if (base64String.charAt(0) === '/') return 'jpeg';
        if (base64String.charAt(0) === 'i') return 'png';
        if (base64String.charAt(0) === 'R') return 'gif';
        if (base64String.charAt(0) === 'U') return 'webp';
        return 'jpeg';
    }

    toggleMenu(menu: string): void {
        if (this.expandedMenu === menu) {
            this.expandedMenu = null;
        } else {
            this.expandedMenu = menu;
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

}
