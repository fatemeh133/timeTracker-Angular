import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { TaskComponent } from './task/task.component';
import { HomeComponent } from './home/home.component';
import { authGuard, Premissionservices } from './services/auth.guard';
import { UserOptionComponent } from './user-option/user-option.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'task',
    component: TaskComponent,
    canActivate: [authGuard],
  },
  { path: 'home', component: HomeComponent },
  { path: 'option', component: UserOptionComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [Premissionservices],
})
export class AppRoutingModule {}
