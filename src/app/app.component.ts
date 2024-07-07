import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { ConnectionService } from './services/connection.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavServiceService } from './services/sidenav-service.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'timeTracker-Angular';
  isLogedin: boolean = false;
  @ViewChild('sidenav') public sidenav!: MatSidenav;

  //placeholders variables
  private routerSubscription!: Subscription;
  public currentRoute: string = '';

  constructor(
    private service: ConnectionService,
    private sidenavService: SidenavServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnInit() {
    this.service.authchange.subscribe((res) => {
      this.isLogedin = res;
    });

    //router different placeholders
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.getCurrentRoute();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private getCurrentRoute(): string {
    let route = this.activatedRoute.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.routeConfig?.path || '';
  }

  onExit() {
    this.service.authchange.next(false);
    localStorage.removeItem('authchange');
    localStorage.removeItem('logedUserId');
    this.service.logedUserId.next(null);
  }
}
