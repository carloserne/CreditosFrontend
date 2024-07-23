import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SimuladorVistaComponent } from './simulador/simulador-vista/simulador-vista.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'bienvenida', component: BienvenidaComponent, canActivate: [AuthGuard] },
    { path: 'simulador', component: SimuladorVistaComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
