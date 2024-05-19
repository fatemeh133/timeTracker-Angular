import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { codeMeliValidator } from '../../validator/CodeMeli.validator';
import { ConnectionService } from '../../services/connection.service';
import { User } from '../../models/user';
import moment from 'jalali-moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  constructor(private userService: ConnectionService) {}

  reactiveForm!: FormGroup;
  user: User = {
    nameofuser: '',
    codeMeli: '',
    userName: '',
    birthDate: '',
    password: '',
  };

  usernames: string[] = [];
  codemelies: string[] = [];

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      codeMeli: new FormControl('', [Validators.required, codeMeliValidator]),
      userName: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.getUsersUserNamesAndCodeMelies();
  }

  onSubmit(form: FormGroup) {
    this.user.nameofuser = form.controls['name'].value;
    this.user.codeMeli = form.controls['codeMeli'].value.toString();
    this.user.password = form.controls['password'].value;

    const jsDate = form.controls['birthDate'].value['_d'].toString();
    const persianDate = moment(jsDate).format('jYYYY/jMM/jDD');

    this.user.birthDate = persianDate;
    this.user.userName = form.controls['userName'].value;

    console.log('user details sent to form', this.user);

    if (this.usernames.includes(this.user.userName)) {
      this.userService.openSnackBar('نام کاربری تکراری', 'بستن');
    } else if (this.codemelies.includes(this.user.codeMeli)) {
      this.userService.openSnackBar('کدملی تکراری', 'بستن');
    } else {
      this.userService.postUser(this.user);
      this.userService.userPost.subscribe(() => {
        form.reset();
      });
    }
  }

  getUsersUserNamesAndCodeMelies() {
    this.userService.getUser();
    this.userService.users.subscribe((res) => {
      console.log('get res oninit', res);
      for (var i = 0; i < res.length; i++) {
        if (res[i] && res[i].userName) {
          this.usernames.push(res[i].userName);
        }
      }
      for (var i = 0; i < res.length; i++) {
        if (res[i] && res[i].codeMeli) {
          this.codemelies.push(res[i].codeMeli);
        }
      }
      console.log(this.usernames);
      console.log(this.codemelies);
    });
  }
}
