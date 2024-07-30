import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SimuladorVistaComponent } from './creditos/simulador-vista/simulador-vista.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { AuthGuard } from './auth.guard';
import { EmpresaComponent } from './configuracion/empresa/empresa.component';
import { UsuariosComponent } from './configuracion/usuarios/usuarios.component';
import { ClientesComponent } from './configuracion/clientes/clientes.component';
import { DocumentosComponent } from './expedientes/documentos/documentos.component';
import { DocumentousuarioComponent } from './expedientes/documentousuario/documentousuario.component';
import { CatConceptoComponent } from './creditos/cat-concepto/cat-concepto.component';
import { ProductoComponent } from './creditos/producto/producto.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'bienvenida', component: BienvenidaComponent, canActivate: [AuthGuard] },
    { path: 'simulador', component: SimuladorVistaComponent, canActivate: [AuthGuard] },
    { path: 'creditos/conceptos', component: CatConceptoComponent, canActivate: [AuthGuard] },
    { path: 'creditos/productos', component: ProductoComponent, canActivate: [AuthGuard] },
    { path: 'expedientes/documentos', component: DocumentosComponent, canActivate: [AuthGuard] },
    { path: 'expedientes/documentousuario', component: DocumentousuarioComponent, canActivate: [AuthGuard] },
    { path: 'configuracion/empresas', component: EmpresaComponent, canActivate: [AuthGuard] },
    { path: 'configuracion/usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
    { path: 'configuracion/clientes', component: ClientesComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
