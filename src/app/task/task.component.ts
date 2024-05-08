import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ConnectionService } from '../services/connection.service';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../services/task';

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
  userIdRecived!: number | null;
  displayedColumns: string[] = ['taskName', 'duration', 'delete', 'taskId'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  reactiveForm!: FormGroup;
  ELEMENT_DATA: PeriodicElement[] = [];
  task: Task = {
    taskId: 0,
    userId: 0,
    taskName: '',
    duration: '0',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit() {
    this.reactiveForm = new FormGroup({
      taskName: new FormControl('', Validators.required),
    });
  }
  onsubmit(form: FormGroup) {
    this.task.taskName = form.controls['taskName'].value;
    this.service.logedUserId.subscribe((logedUserId) => {
      this.task.userId = logedUserId!;
    });

    this.service.postTask(this.task).subscribe((res) => {
      console.log(res);
      this.fillTalbeByUserTasks();
      form.reset();
    });
  }
  onDelete(id: number) {
    this.service.deleteTask(id).subscribe((res) => {
      console.log(res);
      this.fillTalbeByUserTasks();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.service.logedUserId.subscribe((userId) => {
      console.log('loged user id', userId);
      this.userIdRecived = userId;
    });
    this.fillTalbeByUserTasks();
  }

  fillTalbeByUserTasks() {
    this.service.getTask().subscribe((res) => {
      this.ELEMENT_DATA = [];
      for (let i = 0; i < res.length; i++) {
        if (this.userIdRecived == res[i].userId) {
          console.log(res[i].taskName, res[i].duration, res[i].taskId);

          this.ELEMENT_DATA.push({
            taskName: res[i].taskName,
            duration: res[i].duration,
            delete: '',
            taskId: res[i].taskId!,
          });
        }
      }
      this.dataSource.data = this.ELEMENT_DATA;
    });
  }

  updateTaskName(event: any, duration: any, id: any) {
    this.task.taskName = event.innerText;
    this.task.duration = duration;
    this.task.taskId = id;
    this.service.logedUserId.subscribe((res) => {
      this.task.userId = res!;
    });

    console.log('task', this.task);
    this.service.updateTask(id, this.task).subscribe(() => {
      this.fillTalbeByUserTasks();
    });
  }

  updateDuration(event: any, name: any, id: any) {
    this.task.duration = event.innerText;
    this.task.taskName = name;
    this.task.taskId = id;
    this.service.logedUserId.subscribe((res) => {
      this.task.userId = res!;
    });

    console.log('task', this.task);
    this.service.updateTask(id, this.task).subscribe(() => {
      this.fillTalbeByUserTasks();
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
  delete: string;
  taskId: number;
}
