import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  reactiveForm!: FormGroup;
  users: { username: string; passwords: string; id: any }[] = [];
  isLoading: boolean = false;

  constructor(private userService: ConnectionService, private router: Router) {}

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.getUsers();
  }

  ngDoCheck() {
    if (localStorage.getItem('logedUserId')) {
      this.userService.getFromStorage();
    }
  }
  getUsers() {
    this.users = [];
    this.userService.getUser();
    this.userService.users.subscribe((res) => {
      console.log('res', res);

      for (var i = 0; i < res.length; i++) {
        if (res[i] && res[i].userName && res[i].password) {
          const newUser = {
            username: res[i].userName,
            passwords: res[i].password,
            id: res[i].userId,
          };
          this.users.push(newUser);
        }
      }
      console.log('users', this.users);
    });
  }
  onSubmit(form: FormGroup) {
    this.isLoading = true;
    let userFound = false; // flag to check if user is found

    for (var i = 0; i < this.users.length; i++) {
      if (
        this.users[i].username === form.controls['name'].value &&
        this.users[i].passwords === form.controls['password'].value
      ) {
        // save user
        this.userService.logedUserId.next(this.users[i].id);
        this.userService.authchange.next(true);

        // save being logged in in storage
        localStorage.setItem('logedUserId', this.users[i].id.toString());
        localStorage.setItem('authchange', 'true');

        this.userService.openSnackBar('خوش آمدید', 'بستن', 'success');
        this.router.navigate(['/task']);

        userFound = true; // set the flag to true
        break; // break the loop when user is found
      }
    }

    if (!userFound) {
      this.userService.openSnackBar(
        'کاربری بااین مشخصات وجود ندارد',
        'بستن',
        'error'
      );

      this.isLoading = false;
    }
  }
}
