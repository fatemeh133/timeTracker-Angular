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
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private service: ConnectionService
  ) {}

  ngOnInit() {}
  userIdRecived!: number | null;
  displayedColumns: string[] = ['taskName', 'duration'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.service.logedUserId.subscribe((userId) => {
      console.log('loged user id', userId);
      this.userIdRecived = userId;
    });
    this.service.getTask().subscribe((res) => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        if (this.userIdRecived == res[i].userId) {
          console.log(res[i].taskName, res[i].duration);
          ELEMENT_DATA.push({
            taskName: res[i].taskName,
            duration: res[i].duration,
          });
        }
      }
      console.log(ELEMENT_DATA);
      this.dataSource.data = ELEMENT_DATA;
    });
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
  taskName: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];
