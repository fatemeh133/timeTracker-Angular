import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection.service';
import { Subject } from 'rxjs';
import { SidenavServiceService } from '../services/sidenav-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(
    private service: ConnectionService,
    private sidenavService: SidenavServiceService
  ) {}

  isLogedin: boolean = false;
  loggedInId!: number;
  imageUrl: string | null = null;

  ngOnInit() {
    this.service.authchange.subscribe((res) => {
      this.isLogedin = res;
    });
  }

  ngAfterViewInit() {
    this.loggedInId = Number(localStorage.getItem('logedUserId'));

    this.service.getOneUser(this.loggedInId);
    this.service.user.subscribe((user) => {
      if (user.profilePicturePath) {
        this.imageUrl = user.profilePicturePath;
      }
    });
  }
  
  onExit() {
    this.service.authchange.next(false);
    localStorage.removeItem('authchange');

    localStorage.removeItem('logedUserId');
    this.service.logedUserId.next(null);
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }
}
