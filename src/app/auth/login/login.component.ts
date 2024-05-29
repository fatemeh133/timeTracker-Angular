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

  constructor(private userService: ConnectionService, private router: Router) {}

  getUsersUserNamesAndPasswords() {
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

  ngOnInit() {
    this.getUsersUserNamesAndPasswords();

    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngDoCheck() {
    this.userService.getFromStorage();
  }

  onSubmit(form: FormGroup) {
    for (var i = 0; i < this.users.length; i++) {
      if (
        this.users[i].username === form.controls['name'].value &&
        this.users[i].passwords === form.controls['password'].value
      ) {
        //save user
        this.userService.logedUserId.next(this.users[i].id);
        this.userService.authchange.next(true);

        //save being loged in in storage
        localStorage.setItem('logedUserId', this.users[i].id.toString());
        localStorage.setItem('authchange', 'true');

        this.userService.openSnackBar('خوش آمدید', 'بستن', 'success');
        this.router.navigate(['/task']);
      } else if (
        this.users[i].username !== form.controls['name'].value &&
        this.users[i].passwords !== form.controls['password'].value
      ) {

        this.userService.openSnackBar(
          'کاربری بااین مشخصات وجود ندارد',
          'بستن',
          'error'
        );
      }
    }
  }
}
