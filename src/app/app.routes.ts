import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SimuladorVistaComponent } from './simulador/simulador-vista/simulador-vista.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'bienvenida', component: BienvenidaComponent },
    { path: 'simulador', component: SimuladorVistaComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }  
];
