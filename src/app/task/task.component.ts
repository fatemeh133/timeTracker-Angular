import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ConnectionService } from '../services/connection.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements AfterViewInit, OnInit {
  userIdRecived!: number | null;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private service: ConnectionService
  ) {}

  ngOnInit() {
    this.service.logedUserId.subscribe((userId) => {
      console.log('loged user id', userId);
      this.userIdRecived = userId;
    });
    this.service.getTask().subscribe((res) => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        if (this.userIdRecived == res[i].userId) {
          console.log(res[i].taskName, res[i].duration);
        }
      }
    });
  }

  displayedColumns: string[] = ['taskName', 'duration'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

export interface PeriodicElement {
  duration: string;
  taskName: number;
}
const ELEMENT_DATA: PeriodicElement[] = [{ taskName: 1, duration: 'Hydrogen' }];
