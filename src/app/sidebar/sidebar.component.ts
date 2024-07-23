import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    expandedMenu: string | null = null;

    constructor(private router: Router) {}

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
