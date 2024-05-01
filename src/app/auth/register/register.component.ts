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
    nameOfUser: '',
    codeMeli: 0,
    userName: '',
    birthDate: '',
    password: '',
  };
  usernames: string[] = [];
  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      codeMeli: new FormControl('', [Validators.required, codeMeliValidator]),
      userName: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.userService.getUser().subscribe((res) => {
      console.log('get res oninit', res);
      for (var i = 0; i < res.length; i++) {
        if (res[i] && res[i].userName) {
          console.log(res[i].userName);
          this.usernames.push(res[i].userName);
        }
      }
      console.log(this.usernames);
    });
  }

  onSubmit(form: FormGroup) {
    this.user.nameOfUser = form.controls['name'].value;
    this.user.codeMeli = form.controls['codeMeli'].value;
    this.user.password = form.controls['password'].value;
    this.user.birthDate = form.controls['birthDate'].value['_d'].toString();
    this.user.userName = form.controls['userName'].value;

    console.log('user details sent to form', this.user);

    this.userService.getUser().subscribe((res) => {
      if (this.usernames.includes(this.user.userName)) {
        console.log('user exists');
      } else {
        this.userService.postUser(this.user).subscribe((res) => {
          console.log('res from post after if', res);
        });
        form.reset();
      }
    });
  }
}
