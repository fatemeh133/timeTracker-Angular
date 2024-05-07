import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { BehaviorSubject, Subject } from 'rxjs';
import { Task } from './task';

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

  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get<User[]>(this.userUrl);
  }
  postUser(user: User) {
    return this.http.post<User>(this.userUrl, user);
  }

  getTask() {
    return this.http.get<Task[]>(this.taskUrl);
  }
}
