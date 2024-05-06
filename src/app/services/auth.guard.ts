import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from './connection.service';

@Injectable()
export class Premissionservices {
  isauth: boolean = false;
  constructor(private authService: ConnectionService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('Guard is being executed');
    this.authService.authchange.subscribe((res) => {
      this.isauth = res;
    });
    if (this.isauth) {
      console.log('User is loged in', this.isauth);
      return true;
    } else {
      console.log('redirecting to login');
      this.router.navigate(['/login']); // Redirect to login page if not logged in
      return false;
    }
  }
}

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(Premissionservices).canActivate(route, state);
};
