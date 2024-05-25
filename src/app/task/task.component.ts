import {
  AfterViewInit,
  Component,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ConnectionService } from '../services/connection.service';
import { interval, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../models/task';
import { PeriodicElement } from '../models/table-content';
import { MatDialog } from '@angular/material/dialog';
import { CencelDialogComponent } from '../cencel-dialog/cencel-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements AfterViewInit, OnInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private service: ConnectionService,
    public dialog: MatDialog
  ) {}
  userIdRecived!: number | null;
  displayedColumns: string[] = [
    'taskName',
    'duration',
    'timeRecord',
    'delete',
    'taskId',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();
  reactiveForm!: FormGroup;
  ELEMENT_DATA: PeriodicElement[] = [];

  task: Task = {
    taskId: 0,
    userId: 0,
    taskName: '',
    duration: '0',
  };

  timers: {
    timerValue: number;
    timerSubscription: Subscription;
    isTimerRunning: boolean;
  }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      taskName: new FormControl('', Validators.required),
    });
  }
  onsubmit(form: FormGroup) {
    this.task = { taskId: 0, userId: 0, taskName: '', duration: '0' };
    console.log('task', this.task);

    this.task.taskName = form.controls['taskName'].value;
    this.service.logedUserId.subscribe((logedUserId) => {
      this.task.userId = logedUserId!;
    });

    this.service.postTask(this.task);
    this.service.taskPosted.subscribe(() => {
      this.fillTalbeByUserTasks();
      form.reset();
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
    this.service.getTask();
    this.service.Tasks.subscribe((res) => {
      this.ELEMENT_DATA = [];
      this.timers = [];
      for (let i = 0; i < res.length; i++) {
        if (this.userIdRecived == res[i].userId) {
          console.log(res[i].taskName, res[i].duration, res[i].taskId);

          this.ELEMENT_DATA.push({
            taskName: res[i].taskName,
            duration: res[i].duration,
            delete: '',
            taskId: res[i].taskId!,
          });
          this.timers.push({
            timerValue: Number(res[i].duration),
            timerSubscription: new Subscription(),
            isTimerRunning: false,
          });
          console.log('timers', this.timers);
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

    this.updateTask(id, this.task);
  }

  updateDurationByRecord(name: any, duration: any, id: any) {
    this.task.taskName = name;
    this.task.duration = duration;
    this.task.taskId = id;
    this.service.logedUserId.subscribe((res) => {
      this.task.userId = res!;
    });

    this.updateTask(id, this.task);
  }

  updateDuration(event: any, name: string, id: number) {
    const timeParts = event.innerText.split(':');

    if (timeParts.length !== 3) {
      throw new Error('Invalid time format. Expected hh:mm:ss');
    } else {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      const toSeconds = hours * 3600 + minutes * 60 + seconds;

      this.task.duration = toSeconds.toString();
      this.task.taskName = name;
      this.task.taskId = id;
      this.service.logedUserId.subscribe((res) => {
        this.task.userId = res!;
      });

      this.updateTask(id, this.task);
    }
  }

  updateTask(id: number, task: Task) {
    this.service.updateTask(id, task);
    this.service.taskUpdated.subscribe(() => {
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

  toggleTimer(index: number, name: any, id: any) {
    if (this.timers[index].isTimerRunning) {
      // Stop the timer when its running
      this.timers[index].timerSubscription.unsubscribe();

      this.updateDurationByRecord(
        name,
        this.timers[index].timerValue.toString(),
        id
      );
    } else {
      // Start the timer when timer is'nt running
      this.timers[index].timerSubscription = interval(1000).subscribe(() => {
        this.timers[index].timerValue++;
        this.ELEMENT_DATA[index].duration =
          this.timers[index].timerValue.toString();
      });
    }
    // Toggle the timer state
    this.timers[index].isTimerRunning = !this.timers[index].isTimerRunning;
  }
  

  ngOnDestroy() {
    // Unsubscribe from all timer subscriptions
    this.timers.forEach((timer) => {
      if (timer.timerSubscription) {
        timer.timerSubscription.unsubscribe();
      }
    });
  }

  openDialog(id: number) {
    const dialogRef = this.dialog.open(CencelDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteTask(id);
        this.service.taskDeleted.subscribe(() => {
          this.fillTalbeByUserTasks();
        });
      }
    });
  }
}
