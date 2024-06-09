import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  animations: [
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
        })
      ),
      transition(':enter', [animate('1s')]),
    ]),
    trigger('appear', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(20px)',
          margin: '10px',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition(':enter', [animate('1s ease-in-out')]),
    ]),
  ],
})
export class TaskComponent implements AfterViewInit, OnInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private service: ConnectionService,
    public dialog: MatDialog
  ) {}
  userIdRecived!: number | null;
  displayedColumns: string[] = [
    'IsChecked',
    'taskName',
    'date',
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
    isChecked: false,
    date: '',
  };
  tasks!: Array<any>;

  timers: {
    timerValue: number;
    timerSubscription: Subscription;
    isTimerRunning: boolean;
  }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fadeInState!: string;

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      taskName: new FormControl('', Validators.required),
    });

    this.fadeInState = 'in';
    localStorage.setItem('currentRoute', '/task');
  }

  onsubmit(form: FormGroup) {
    // console.log('task', this.task);
    const today = Date.now();

    const todayFa = {
      day: this.getDateFormat(today, { day: '2-digit' }),
      month: this.getDateFormat(today, { month: 'numeric' }),
      monthTitle: this.getDateFormat(today, { month: 'long' }),
      year: this.getDateFormat(today, { year: 'numeric' }),
      dayWeek: this.getDateFormat(today, { weekday: 'long' }),
    };

    // console.log(todayFa.dayWeek, todayFa.day, todayFa.monthTitle, todayFa.year);
    const date = `${todayFa.dayWeek} ${todayFa.day} ${todayFa.monthTitle} ${
      todayFa.year
    } - ${new Date().getHours()}:${new Date().getMinutes()}`;

    this.task.taskName = form.controls['taskName'].value;
    this.service.logedUserId.subscribe((logedUserId) => {
      this.task.userId = logedUserId!;
    });
    this.task.date = date;

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
      // console.log('loged user id', userId);
      this.userIdRecived = userId;
    });
    this.fillTalbeByUserTasks();

    this.service.getTask();
    this.service.Tasks.subscribe((res) => {
      this.tasks = [];
      for (let i = 0; i < res.length; i++) {
        if (this.userIdRecived == res[i].userId) {
          this.tasks.push({
            taskName: res[i].taskName,
            duration: res[i].duration,
            taskId: res[i].taskId!,
            isChecked: res[i].isChecked,
            date: res[i].date,
          });
        }
      }
      console.log(this.tasks);
    });
    console.log('element', this.task);
  }

  getDateFormat(uDate: any, option: any) {
    let date = new Intl.DateTimeFormat('fa-IR', option).format(uDate);
    return date;
  }

  fillTalbeByUserTasks() {
    this.service.getTask();
    this.service.Tasks.subscribe((res) => {
      this.ELEMENT_DATA = [];
      this.timers = [];
      for (let i = 0; i < res.length; i++) {
        if (this.userIdRecived == res[i].userId) {
          // console.log('ischecked', res[i].isChecked);
          // console.log(res);

          this.ELEMENT_DATA.push({
            taskName: res[i].taskName,
            duration: res[i].duration,
            delete: '',
            taskId: res[i].taskId!,
            isChecked: res[i].isChecked,
            date: res[i].date,
          });
          this.timers.push({
            timerValue: Number(res[i].duration),
            timerSubscription: new Subscription(),
            isTimerRunning: false,
          });
          // console.log('timers', this.timers);
        }
      }
      this.dataSource.data = this.ELEMENT_DATA;
    });
  }

  updateTaskName(
    event: any,
    duration: any,
    id: any,
    isChecked: boolean,
    date: any
  ) {
    this.task.taskName = event.innerText;
    this.task.duration = duration;
    this.task.taskId = id;
    this.service.logedUserId.subscribe((res) => {
      this.task.userId = res!;
    });
    this.task.isChecked = isChecked;
    this.task.date = date;

    this.updateTask(id, this.task);
  }

  updateDurationByRecord(name: any, duration: any, id: any, date: string) {
    this.task.taskName = name;
    this.task.duration = duration;
    this.task.taskId = id;
    this.service.logedUserId.subscribe((res) => {
      this.task.userId = res!;
    });
    this.task.date = date;

    this.updateTask(id, this.task);
  }

  updateDuration(
    event: any,
    name: string,
    id: number,
    isChecked: boolean,
    date: string
  ) {
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
      this.task.isChecked = isChecked;
      this.task.date = date;

      this.updateTask(id, this.task);
    }
  }

  updateTask(id: number, task: Task) {
    this.service.updateTask(id, task);
    this.service.taskUpdated.subscribe(() => {
      this.fillTalbeByUserTasks();
    });
  }

  updatechecked(
    id: number,
    name: string,
    duration: any,
    isChecked: boolean,
    date: string
  ) {
    this.task.taskName = name;
    this.task.duration = duration;
    this.task.taskId = id;
    this.service.logedUserId.subscribe((res) => {
      this.task.userId = res!;
    });
    this.task.isChecked = !isChecked;
    this.task.date = date;

    this.updateTask(id, this.task);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  toggleTimer(index: number, name: any, id: any, date: any) {
    if (this.timers[index].isTimerRunning) {
      // Stop the timer when its running
      this.timers[index].timerSubscription.unsubscribe();

      this.updateDurationByRecord(
        name,
        this.timers[index].timerValue.toString(),
        id,
        date
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
