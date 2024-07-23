import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-bienvenida',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    templateUrl: './bienvenida.component.html',
    styleUrl: './bienvenida.component.scss'
})
export class BienvenidaComponent {

}
