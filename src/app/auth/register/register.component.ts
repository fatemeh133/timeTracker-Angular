import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { codeMeliValidator } from '../../validator/CodeMeli.validator';
import { ConnectionService } from '../../services/connection.service';
import { User } from '../../services/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  constructor(private userService: ConnectionService) {}
  reactiveForm!: FormGroup;
  user: User = {
    NameOfUser: '',
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
    this.user.NameOfUser = form.controls['name'].value;
    this.user.codeMeli = form.controls['codeMeli'].value.toString();
    this.user.password = form.controls['password'].value;
    this.user.birthDate = form.controls['birthDate'].value['_d'].toString();
    this.user.userName = form.controls['userName'].value;

    console.log('user details sent to form', this.user);

    if (this.usernames.includes(this.user.userName)) {
      alert('نام کاربری تکراری');
    } else if (this.codemelies.includes(this.user.codeMeli)) {
      alert('کد ملی تکراری');
    } else {
      this.userService.postUser(this.user).subscribe((res) => {
        console.log('res from post after if', res);
      });
      form.reset();
    }
  }

  getUsersUserNamesAndCodeMelies() {
    this.userService.getUser().subscribe((res) => {
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