import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { codeMeliValidator } from '../../validator/CodeMeli.validator';
import { ConnectionService } from '../../services/connection.service';
import moment from 'jalali-moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  constructor(private userService: ConnectionService) {}

  reactiveForm!: FormGroup;

  usernames: string[] = [];
  codemelies: string[] = [];

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      codeMeli: new FormControl('', [Validators.required, codeMeliValidator]),
      userName: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      profilePicture: new FormControl(''),
    });

    this.getUsersUserNamesAndCodeMelies();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.reactiveForm.patchValue({
        profilePicture: file,
      });
    }
  }

  onSubmit(form: FormGroup) {
    const formData = new FormData();

    const nameOfUser = form.controls['name'].value;
    const codeMeli = form.controls['codeMeli'].value.toString();
    const password = form.controls['password'].value;
    const jsDate = form.controls['birthDate'].value['_d'].toString();
    const persianDate = moment(jsDate).format('jYYYY/jMM/jDD');
    const birthDate = persianDate;
    const userName = form.controls['userName'].value;

    if (form.controls['profilePicture'].value) {
      formData.append('profilePicture', form.controls['profilePicture'].value);
    }

    formData.append('nameOfUser', nameOfUser);
    formData.append('codeMeli', codeMeli);
    formData.append('password', password);
    formData.append('birthDate', birthDate);
    formData.append('userName', userName);

    if (this.usernames.includes(userName)) {
      this.userService.openSnackBar('نام کاربری تکراری', 'بستن', 'error');
    } else if (this.codemelies.includes(codeMeli)) {
      this.userService.openSnackBar('کدملی تکراری', 'بستن', 'error');
    } else {
      this.userService.postUser(formData).subscribe(() => {
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
