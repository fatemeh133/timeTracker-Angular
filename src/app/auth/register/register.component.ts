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
  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      codeMeli: new FormControl('', [Validators.required, codeMeliValidator]),
      userName: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.userService.getUser().subscribe((res) => {
      console.log(res);
    });
  }

  onSubmit(form: FormGroup) {
    console.log('name', form.controls['name'].value);
    console.log('codeMeli', form.controls['codeMeli'].value);
    console.log('password', form.controls['password'].value);
    console.log('birthDate', form.controls['birthDate'].value['_d']);
    console.log('userName', form.controls['userName'].value);
  }
}
