import { Component, ViewChild } from '@angular/core';
import { ConnectionService } from './services/connection.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavServiceService } from './services/sidenav-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'timeTracker-Angular';
  constructor(private service: ConnectionService,private sidenavService:SidenavServiceService) {}
  isLogedin: boolean = false;
  @ViewChild('sidenav') public sidenav!: MatSidenav;

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnInit() {
    this.service.authchange.subscribe((res) => {
      this.isLogedin = res;
    });
  }

  onExit() {
    this.service.authchange.next(false);
    localStorage.removeItem('authchange');

    localStorage.removeItem('logedUserId');
    this.service.logedUserId.next(null);
  }
}
