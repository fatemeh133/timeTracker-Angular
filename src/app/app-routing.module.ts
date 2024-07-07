import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { TaskComponent } from './task/task.component';
import { HomeComponent } from './home/home.component';
import { authGuard, Premissionservices } from './services/auth.guard';
import { UserOptionComponent } from './user-option/user-option.component';

const routes: Routes = [
  { path: '', component: HomeComponent,   data: { placeholder: 'home' } },
  { path: 'register', component: RegisterComponent,   data: { placeholder: 'register' } },
  { path: 'login', component: LoginComponent,   data: { placeholder: 'login' } },
  {
    path: 'task',
    component: TaskComponent,
    canActivate: [authGuard],   data: { placeholder: 'task' }
  },
  { path: 'home', component: HomeComponent,   data: { placeholder: 'home' } },
  { path: 'option', component: UserOptionComponent, canActivate: [authGuard],   data: { placeholder: 'option' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [Premissionservices],
})
export class AppRoutingModule {}
