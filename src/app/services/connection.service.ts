import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { BehaviorSubject, Subject } from 'rxjs';
import { Task } from './task';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  readonly userUrl = 'https://localhost:7213/api/UserInfoes';
  readonly taskUrl = 'https://localhost:7213/api/TaskInfoes';

  authchange = new Subject<boolean>();
  logedUserId: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);

  constructor(private http: HttpClient,private router:Router) {}

  getUser() {
    return this.http.get<User[]>(this.userUrl);
  }
  postUser(user: User) {
    return this.http.post<User>(this.userUrl, user);
  }

  getTask() {
    return this.http.get<Task[]>(this.taskUrl);
  }
  postTask(task: Task) {
    return this.http.post<Task[]>(this.taskUrl, task);
  }
  deleteTask(id: number) {
    return this.http.delete<number>(this.taskUrl + '/' + id);
  }
  updateTask(id: number, task: Task) {
    return this.http.put<Task>(this.taskUrl + '/' + id, task);
  }

  getFromStorage() {
    //access to local storage and see if user is loged in
    if (localStorage.getItem('authchange')) {
      this.authchange.next(true);

      this.logedUserId.next(
        Number(localStorage.getItem('logedUserId'))
      );
      this.router.navigate(['/task']);
    } else {
      this.authchange.next(false);
    }
  }
}
