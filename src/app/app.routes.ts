import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { SimuladorVistaComponent } from './simulador/simulador-vista/simulador-vista.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'simulador', component: SimuladorVistaComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }  
];
