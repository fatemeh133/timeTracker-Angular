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
  usernames: string[] = [];
  Passwords: string[] = [];
  reactiveForm!: FormGroup;
  isLogged = false;

  constructor(private userService: ConnectionService, private router: Router) {}

  ngOnInit() {
    this.getUsersUserNamesAndPasswords();

    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(form: FormGroup) {
    this.userService.getUser().subscribe((res) => {
      for (var i = 0; i < res.length; i++) {
        if (
          res[i] &&
          res[i].userName === form.controls['name'].value &&
          res[i].password === form.controls['password'].value
        ) {
          this.isLogged = true;
          this.userService.authchange.next(this.isLogged)
        } else {
          this.isLogged = false;
          this.userService.authchange.next(this.isLogged)
        }
      }
      if (this.isLogged == true) {
        alert('وارد شدید');
        this.router.navigate(['/task']);
      } else {
        alert('کاربری بااین مشخصات وجود ندارد');
      }
    });
  }

  getUsersUserNamesAndPasswords() {
    this.userService.getUser().subscribe((res) => {
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
