import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent],
    // templateUrl: './inicio.component.html',
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss'
})
export class InicioComponent {
    expandedMenu: string | null = null;

    constructor(private router: Router) {}

    toggleMenu(menu: string): void {
        if (this.expandedMenu === menu) {
            this.expandedMenu = null; // Cierra el menú si ya está abierto
        } else {
            this.expandedMenu = menu; // Abre el menú si está cerrado
        }
    }

    mostrarSimulador(): void {
        // Navegar al componente de simulador
        this.router.navigate(['/simulador']);
    }

}
