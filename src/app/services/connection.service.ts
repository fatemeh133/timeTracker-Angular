import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  readonly url = 'https://localhost:7213/api/UserInfoes';
  constructor(private http: HttpClient) {}
  getUser() {
    return this.http.get<User[]>(this.url);
  }
  postUser(user: User) {
    return this.http.post<User>(this.url, user);
  }
}
