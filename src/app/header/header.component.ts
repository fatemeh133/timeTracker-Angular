import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../services/connection.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(private service: ConnectionService) {}

  isLogedin: boolean = false;

  ngOnInit() {
    this.service.authchange.subscribe((res) => {
      this.isLogedin = res;
    });
  }

  onExit() {
    this.service.authchange.next(false);
  }
}
