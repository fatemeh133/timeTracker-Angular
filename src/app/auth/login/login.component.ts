import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  reactiveForm!: FormGroup;
  usernames: string[] = [];
  Passwords: string[] = [];
  isLogged = false;
  id!: number;

  constructor(private userService: ConnectionService, private router: Router) {}

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
    this.userService.getUser();
    this.userService.users.subscribe((res) => {
      for (var i = 0; i < res.length; i++) {
        if (
          res[i].userName === form.controls['name'].value &&
          res[i].password === form.controls['password'].value
        ) {
          this.isLogged = true;
          this.id = res[i].userId!;
        }
        console.log(this.isLogged);
      }

      this.userService.logedUserId.next(this.id);
      this.userService.authchange.next(this.isLogged);
      //save being loged in in storage
      localStorage.setItem('logedUserId', this.id.toString());
      localStorage.setItem('authchange', this.isLogged.toString());

      if (this.isLogged == true) {
        this.router.navigate(['/task']);
      } else {
        alert('کاربری بااین مشخصات وجود ندارد');
      }
    });
  }

  getUsersUserNamesAndPasswords() {
    this.userService.getUser();
    this.userService.users.subscribe((res) => {
      console.log('get res oninit', res);

      for (var i = 0; i < res.length; i++) {
        if (res[i] && res[i].userName) {
          this.usernames.push(res[i].userName);
        }
      }
      for (var i = 0; i < res.length; i++) {
        if (res[i] && res[i].password) {
          this.Passwords.push(res[i].password);
        }
      }
      console.log(this.usernames);
      console.log(this.Passwords);
    });
  }
}
