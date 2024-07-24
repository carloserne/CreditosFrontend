import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, SidebarComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'CreditosFrontEnd';
    mostrarSidebar: boolean = false;

    constructor(private loginService: LoginService, private router: Router) { }

    ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.mostrarSidebar = this.loginService.isLogged() && !this.isLoginPage();
            }
        });
    }

    private isLoginPage(): boolean {
        return this.router.url === '/login';
    }
}
