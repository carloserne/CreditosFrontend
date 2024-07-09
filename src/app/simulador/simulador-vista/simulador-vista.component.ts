import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
    selector: 'app-simulador-vista',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    templateUrl: './simulador-vista.component.html',
    styleUrl: './simulador-vista.component.scss'
})
export class SimuladorVistaComponent {

}
