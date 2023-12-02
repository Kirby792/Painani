import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ExplorarComponent } from './explorar/explorar.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';


const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'signup', component: RegisterComponent},
  {path: 'explorar', component: ExplorarComponent},
  {path: 'notificaciones', component: NotificacionesComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a 'tab1' por defecto}
  {path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: '', redirectTo: '/signup', pathMatch: 'full' },
  {path: '', redirectTo: '/explorar', pathMatch: 'full' },
  {path: '', redirectTo: '/notificaciones', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
